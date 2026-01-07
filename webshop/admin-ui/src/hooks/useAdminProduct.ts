import { useEffect, useReducer } from "react";
import { getAdminProduct, type AdminProductDetailDto } from "../api/adminCatalog.api";

type State =
    | { status: "loading"; data: null; error: null }
    | { status: "success"; data: AdminProductDetailDto; error: null }
    | { status: "error"; data: null; error: string };

type Action = { type: "success"; payload: AdminProductDetailDto } | { type: "error"; payload: string };

function reducer(_: State, action: Action): State {
    switch (action.type) {
        case "success":
            return { status: "success", data: action.payload, error: null };
        case "error":
            return { status: "error", data: null, error: action.payload };
    }
}

export function useAdminProduct(id: string) {
    const [state, dispatch] = useReducer(reducer, {
        status: "loading",
        data: null,
        error: null
    });

    useEffect(() => {
        let cancelled = false;

        getAdminProduct(id)
            .then((res) => {
                if (!cancelled) dispatch({ type: "success", payload: res });
            })
            .catch((err) => {
                if (!cancelled) dispatch({ type: "error", payload: err.message });
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    return {
        product: state.data,
        loading: state.status === "loading",
        error: state.error
    };
}
