export enum Resolution {
    P144, P240, P360, P480, P720, P1080, P1440, P2160
}

export type DB = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null | undefined
    createdAt: string
    publicationDate: string
    availableResolutions: Resolution | undefined
}

export let db: DB[] = []