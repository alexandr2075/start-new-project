export enum Resolution {
    P144, P240, P360, P480, P720, P1080, P1440, P2160
}

export type dbVideo = {
    id: number
    title: string | undefined
    author: string | undefined
    canBeDownloaded: boolean | undefined
    minAgeRestriction: number | null | undefined
    createdAt: string
    publicationDate: string | undefined
    availableResolutions: Resolution[] | undefined
}

export let db: dbVideo[] = []