import { useCallback, useMemo, useState } from 'react';
import { createSlots, createSlot, doesSlotOverlap } from '../utils/timeslots';
import { SlotType, RawSlotType, UpdateSlotParams } from '../allTypes';
export const useTimeslots = (
    startTime: Date | number,
    endTime: Date | number,
    slotLength = 30 * 60,
    unavailableTimes: RawSlotType[]
) => {
    const [unavailableSlots, setUnavailableSlots] = useState<SlotType[]>(
        unavailableTimes.map<SlotType>(ut => createSlot(ut))
    );
    const processedSlots = useMemo(() => {
        const slots = createSlots(startTime, endTime, slotLength);
        return slots.map(slot => {
            return {
                ...slot,
                isAvailable: doesSlotOverlap(slot, unavailableSlots),
            } as SlotType;
        });
    }, [unavailableSlots]);
    const [slots, setSlots] = useState<SlotType[]>(processedSlots);
    
    /**
     * Update a single slot
     * it will initiate the rerender on update
     */
    const updateSlot = useCallback(
        (slotId: string, updateFields: UpdateSlotParams) => {
            setSlots(prevSlots => {
                const prevSlot = prevSlots.filter(s => s.id === slotId).pop();
                return [
                    ...prevSlots,
                    {
                        ...prevSlot,
                        ...updateFields,
                    },
                ];
            });
        },
        []
    );
};
