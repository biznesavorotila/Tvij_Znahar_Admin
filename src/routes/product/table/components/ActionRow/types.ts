export type TActionProps = {
    onAction: (type: TActions) => void;
    isPublished: boolean;
}

export type TActions = 'hide' | 'publish' | 'delete' | 'edit';