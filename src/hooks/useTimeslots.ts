import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSlots, createSlot, doesSlotOverlap } from '../utils/timeslots';
import { SlotType, RawSlotType, UpdateSlotParams } from '../allTypes';
export const useTimeslots = (
    startTime: Date | number,
    endTime: Date | number,
    slotLength = 30 * 60,
    unavailableTimes: RawSlotType[] = []
) => {
    const [unavailableSlots, setUnavailableSlots] = useState<SlotType[]>(
        unavailableTimes.map<SlotType>(ut => createSlot(ut))
    );
    const unprocessedSlots = useMemo(
        () => createSlots(startTime, endTime, slotLength),
        [startTime, endTime, slotLength]
    );
    const [slots, setSlots] = useState<SlotType[]>(unprocessedSlots);

    /**
     * update the slots availability every time unavailable times
     * get changed
     */
    useEffect(() => {
        const processedSlots = unprocessedSlots.map(slot => {
            return {
                ...slot,
                isAvailable: doesSlotOverlap(slot, unavailableSlots),
            } as SlotType;
        });
        setSlots(processedSlots);
    }, [unavailableSlots, unprocessedSlots]);

    /**
     * Update a single slot
     * it will initiate the rerender on update
     */
    const updateSlot = useCallback(
        (slotId: string, updateFields: UpdateSlotParams) => {
            setSlots(prevSlots => {
                const prevSlot = prevSlots.filter(s => s.id === slotId).pop();
                if (!prevSlot) {
                    return prevSlots;
                }
                let updatedSlot = Object.entries(updateFields).reduce(
                    (result, [key, value]) => {
                        if (value) {
                            result[key] = value;
                        }
                        return result;
                    },
                    prevSlot as { [key: string]: any }
                ) as SlotType;
                return [
                    ...prevSlots,
                    {
                        ...prevSlot,
                        ...updatedSlot,
                    },
                ];
            });
        },
        []
    );

    /**
     * this will push new unavailable times to unavailable times array
     * and will process the slots again to update their availability
     *
     * **NOTE**: This will NOT remove the previous unvailable times
     */
    const addNewUnavailableTimes = useCallback(
        (newUnavailableTimes: RawSlotType[]) => {
            setUnavailableSlots(prevUnavailableSlots => {
                const newUnavailableSlots = newUnavailableTimes.map<SlotType>(
                    ut => createSlot(ut)
                );
                return [...prevUnavailableSlots, ...newUnavailableSlots];
            });
        },
        []
    );

    /**
     * this will remove the previous unavailable times and add new ones
     * and will process the slots again to update their availability
     *
     */
    const updateUnavailableTimes = useCallback(
        (newUnavailableTimes: RawSlotType[]) => {
            setUnavailableSlots(() => {
                return newUnavailableTimes.map<SlotType>(ut => createSlot(ut));
            });
        },
        []
    );

    return {
        slots,
        updateSlot,
        addNewUnavailableTimes,
        updateUnavailableTimes,
    };
};
