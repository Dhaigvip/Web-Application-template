import { useEffect, useReducer } from "react";
import {
    getAdminProducts,
    type AdminProductListQuery,
    type AdminProductListResponseDto
} from "../api/adminCatalog.api";

type State =
    | { status: "idle"; data: null; error: null }
    | { status: "loading"; data: null; error: null }
    | { status: "success"; data: AdminProductListResponseDto; error: null }
    | { status: "error"; data: null; error: string };

type Action =
    | { type: "start" }
    | { type: "success"; payload: AdminProductListResponseDto }
    | { type: "error"; payload: string };

function reducer(_: State, action: Action): State {
    switch (action.type) {
        case "start":
            return { status: "loading", data: null, error: null };
        case "success":
            return { status: "success", data: action.payload, error: null };
        case "error":
            return { status: "error", data: null, error: action.payload };
    }
}

export function useAdminProducts(query: AdminProductListQuery) {
    const { q, isActive, page, pageSize } = query;

    const [state, dispatch] = useReducer(reducer, {
        status: "idle",
        data: null,
        error: null
    });

    useEffect(() => {
        let cancelled = false;

        dispatch({ type: "start" });

        getAdminProducts({ q, isActive, page, pageSize })
            .then((res) => {
                if (!cancelled) {
                    dispatch({ type: "success", payload: res });
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    dispatch({ type: "error", payload: err.message });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [q, isActive, page, pageSize]);

    return {
        data: state.data,
        loading: state.status === "loading",
        error: state.error
    };
}
