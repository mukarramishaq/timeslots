import {
    addSeconds,
    areIntervalsOverlapping,
    differenceInSeconds,
    toDate,
} from 'date-fns';
import { RawSlotType, SlotType } from 'allTypes';
/**
 * create slots from the available duration between start time and end time of a specified length
 *
 * @param {Date|number} startTime start time in Date object or timestamp
 * @param {Date|number} endTime start time in Date object or timestamp
 * @param {number} slotLength length of each slot in seconds. default is 30 mins
 * @returns {Array<SlotType>} slots
 */
export function createSlots(
    startTime: Date | number,
    endTime: Date | number,
    slotLength = 30 * 60
): SlotType[] {
    const start = toDate(startTime);
    const end = toDate(endTime);
    const totalSeconds = differenceInSeconds(end, start);
    const numberOfSlots = Math.round(totalSeconds / slotLength);
    return Array.from(Array(numberOfSlots), (_, i) => {
        return {
            id: `${start.toISOString()}-${end.toISOString()}`,
            start: addSeconds(start, i * slotLength),
            end: addSeconds(start, i * slotLength),
            length: slotLength,
            isAvailable: true,
            metadata: {},
        } as SlotType;
    });
}

/**
 * this will create a simple start time and end time
 * to a proper slot structure
 * @param {Date|number} param0.startTime a Date object or timestamp
 * @param {Date|number} param0.endTime a Date object or timestamp
 * @returns {SlotType}
 */
export function createSlot({ startTime, endTime }: RawSlotType) {
    const start = toDate(startTime);
    const end = toDate(endTime);
    return {
        id: `${start.toISOString()}-${end.toISOString()}`,
        start,
        end,
        length: differenceInSeconds(end, start),
        isAvailable: true,
        metadata: {},
    } as SlotType;
}

/**
 * checks whether a slot overlaps or not against an array of slots. it will return return true if the slot overlaps
 * on any one slot in the slots array otherwise false
 * @param {SlotType} slot SlotType
 * @param {Array<SlotType>} slots Array<SlotType>
 * @param {Boolean} inclusive boolean whether the overlap check is inclusive or not. by default its not
 * @returns {Boolean} true or false for overlapping or not overlapping
 */
export function doesSlotOverlap(
    slot: SlotType,
    slots: SlotType[],
    inclusive = false
) {
    const overlappedSlots = getOverlappingSlots(slot, slots, inclusive);
    return overlappedSlots.length > 0;
}

/**
 * gives an array of overlapping slots from the slots array which overlaps on the given slot
 * @param {SlotType} slot the slot against which we need to check the overlap
 * @param {Array<SlotType>} slots the array of slots from which we need to filter out the overlapped ones
 * @param {Boolean} inclusive the boolean check to enable or disable the inclusive overlap. By default its false (disabled)
 * @returns {Array<SlotType>} an array of slots which overlap
 */
export function getOverlappingSlots(
    slot: SlotType,
    slots: SlotType[],
    inclusive = false
) {
    return slots.filter(s => {
        return areIntervalsOverlapping(slot, s, { inclusive });
    });
}
