import { addSeconds, areIntervalsOverlapping, differenceInSeconds, toDate } from "date-fns";
import { SlotType } from "../types/timeslots";


/**
 * create slots from the available duration between start time and end time of a specified length
 * 
 * @param startTime start time in Date object or timestamp
 * @param endTime start time in Date object or timestamp
 * @param slotLength length of each slot in seconds
 * @returns slots an array of SlotType
 */
export function createSlots(startTime: Date | number, endTime: Date | number, slotLength = 30 * 60): SlotType[] {
    const start = toDate(startTime);
    const end = toDate(endTime);
    const totalSeconds = differenceInSeconds(end, start);
    const numberOfSlots = Math.round(totalSeconds / slotLength);
    return Array.from(Array(numberOfSlots), (_, i) => {
        return {
            start: addSeconds(start, i * slotLength),
            end: addSeconds(start, i * slotLength)
        } as SlotType;
    });
}

/**
 * checks whether a slot overlaps or not against an array of slots. it will return return true if the slot overlaps
 * on any one slot in the slots array otherwise false
 * @param slot SlotType
 * @param slots Array<SlotType>
 * @param inclusive boolean whether the overlap check is inclusive or not. by default its not
 * @returns boolean true or false for overlapping or not overlapping
 */
export function doesSlotOverlap(slot: SlotType, slots: SlotType[], inclusive = false) {
    const overlappedSlots = getOverlappingSlots(slot, slots, inclusive);
    return overlappedSlots.length > 0;
}

/**
 * gives an array of overlapping slots from the slots array which overlaps on the given slot
 * @param slot the slot against which we need to check the overlap
 * @param slots the array of slots from which we need to filter out the overlapped ones
 * @param inclusive the boolean check to enable or disable the inclusive overlap. By default its false (disabled)
 * @returns an array of slots which overlap
 */
export function getOverlappingSlots(slot: SlotType, slots: SlotType[], inclusive = false) {
    return slots.filter(s => {
        return areIntervalsOverlapping(slot, s, { inclusive })
    });
}