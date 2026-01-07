import { useEffect, useReducer } from "react";
import { getAdminCategories, type AdminCategoryTreeNodeDto } from "../api/adminCatalog.api";

type State =
    | { status: "loading"; data: null; error: null }
    | { status: "success"; data: AdminCategoryTreeNodeDto[]; error: null }
    | { status: "error"; data: null; error: string };

type Action = { type: "success"; payload: AdminCategoryTreeNodeDto[] } | { type: "error"; payload: string };

function reducer(_: State, action: Action): State {
    switch (action.type) {
        case "success":
            return { status: "success", data: action.payload, error: null };
        case "error":
            return { status: "error", data: null, error: action.payload };
    }
}

export function useAdminCategories() {
    const [state, dispatch] = useReducer(reducer, {
        status: "loading",
        data: null,
        error: null
    });

    useEffect(() => {
        let cancelled = false;

        getAdminCategories()
            .then((res) => {
                if (!cancelled) dispatch({ type: "success", payload: res });
            })
            .catch((err) => {
                if (!cancelled) dispatch({ type: "error", payload: err.message });
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        categories: state.data,
        loading: state.status === "loading",
        error: state.error
    };
}
