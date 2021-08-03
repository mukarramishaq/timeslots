
export interface SlotType {
    id: string,
    start: Date,
    end: Date,
    length: number,
    isAvailable: boolean,
    metadata: Object //to store custom data for each slot
}

export interface RawSlotType {
    startTime: Date | number,
    endTime: Date | number,
}

export type UpdateSlotParams = {
    id?: string,
    start?: Date,
    end?: Date,
    length?: number,
    isAvailable?: boolean,
    metadata?: Object //to store custom data for each slot
}