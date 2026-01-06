import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class FacetService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Computes ENUM attribute facets for the current product where-clause.
     *
     * - Facets are keyed by Attribute.code (identifier)
     * - Facet values use AttributeValue.value (identifier)
     * - Counts only include products matching the listing filter AND Product.isActive (already enforced by caller's where)
     * - Respects Attribute.isFacetable=true
     *
     * Note: Only ENUM-style facets are supported here (attributeValueId not null).
     */
    async computeAttributeFacets(productWhere: Prisma.ProductWhereInput) {
        const rows = await this.prisma.productAttribute.groupBy({
            by: ["attributeId", "attributeValueId"],
            where: {
                attributeValueId: { not: null },
                product: productWhere,
                attribute: { isFacetable: true }
            },
            _count: { _all: true }
        });

        // groupBy includes nullable key `attributeValueId`; we filtered but keep safe
        const clean = rows.filter((r) => r.attributeValueId !== null);

        if (!clean.length) return {};

        const attributeIds = [...new Set(clean.map((r) => r.attributeId))];
        const valueIds = [...new Set(clean.map((r) => r.attributeValueId!))];

        const [attributes, values] = await Promise.all([
            this.prisma.attribute.findMany({
                where: { id: { in: attributeIds }, isFacetable: true },
                select: {
                    id: true,
                    code: true,
                    sortOrder: true
                }
            }),
            this.prisma.attributeValue.findMany({
                where: { id: { in: valueIds } },
                select: {
                    id: true,
                    value: true,
                    sortOrder: true
                }
            })
        ]);

        const attrMetaById = new Map(attributes.map((a) => [a.id, { code: a.code, sortOrder: a.sortOrder }]));
        const valueMetaById = new Map(values.map((v) => [v.id, { value: v.value, sortOrder: v.sortOrder }]));

        const facets: Record<string, { value: string; count: number }[]> = {};

        for (const row of clean) {
            const attrMeta = attrMetaById.get(row.attributeId);
            const valueMeta = valueMetaById.get(row.attributeValueId!);

            if (!attrMeta || !valueMeta) continue;

            const key = attrMeta.code;
            if (!facets[key]) facets[key] = [];

            facets[key].push({
                value: valueMeta.value,
                count: row._count._all
            });
        }

        // Deterministic sort:
        // - Attributes by Attribute.sortOrder
        // - Values by AttributeValue.sortOrder (fallback to value)
        const sortedFacetEntries = Object.entries(facets).sort((a, b) => {
            const aAttr = attributes.find((x) => x.code === a[0]);
            const bAttr = attributes.find((x) => x.code === b[0]);
            const ao = aAttr?.sortOrder ?? 0;
            const bo = bAttr?.sortOrder ?? 0;
            if (ao !== bo) return ao - bo;
            return a[0].localeCompare(b[0]);
        });

        const sortedFacets: Record<string, { value: string; count: number }[]> = {};
        for (const [code, items] of sortedFacetEntries) {
            sortedFacets[code] = items.sort((x, y) => {
                const xv = values.find((v) => v.value === x.value);
                const yv = values.find((v) => v.value === y.value);
                const xs = xv?.sortOrder ?? 0;
                const ys = yv?.sortOrder ?? 0;
                if (xs !== ys) return xs - ys;
                return x.value.localeCompare(y.value);
            });
        }

        return sortedFacets;
    }

    /**
     * Price facet intentionally not implemented: Product has no price field in schema.
     */
    async computePriceFacet(_productWhere: Prisma.ProductWhereInput) {
        return null;
    }
}
