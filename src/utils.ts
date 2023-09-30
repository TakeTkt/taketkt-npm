import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import add from 'date-fns/add';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import endOfDay from 'date-fns/endOfDay';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import parse from 'date-fns/parse';
import set from 'date-fns/set';
import startOfDay from 'date-fns/startOfDay';
import isEqualWith from 'lodash.isequalwith';
import {
  License,
  Reservation,
  Service,
  Waiting,
  WorkingShift,
  WorkingShifts,
} from './taketkt-types';

export function convertToDate(date: any) {
  if (date instanceof Date) {
    return date;
  } else if (typeof date === 'string') {
    return new Date(date);
  } else if (date && date.seconds) {
    return new Date(date.seconds * 1000);
  } else if (date && date._seconds) {
    return new Date(date._seconds * 1000);
  } else {
    return new Date();
  }
}

export function toNumber(x: any) {
  return x === undefined || x === null || isNaN(x as any) ? 0 : Number(x);
}

export function getUniqueUid() {
  const head = Date.now().toString(36);
  const tail = Math.random().toString(36).substr(2);
  return head + tail;
}

export function cleanObject(obj: any) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'undefined' || typeof obj[key] === null) {
      delete obj[key];
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any) => {
        cleanObject(item);
      });
    }
  });
}

export function convertFromGeoPoint(
  location?: { latitude?: number; longitude?: number } & {
    _latitude?: number;
    _longitude?: number;
  },
) {
  // This method corrects the location object
  if (location?._latitude && location?._longitude) {
    return {
      lat: location._latitude,
      lng: location._longitude,
    };
  } else if (location?.latitude && location?.longitude) {
    return {
      lat: location.latitude,
      lng: location.longitude,
    };
  }
  return {
    lat: 24.7136,
    lng: 46.6753,
  };
}

export function getInitials(name = '') {
  return name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map(v => v && v[0].toUpperCase())
    .join('');
}

export function isDeepEqual<T>(objA: T, objB: T) {
  return isEqualWith(objA, objB);
}

export function filterNestedObject<T extends object>(obj: T, key: keyof T) {
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (i == key) {
      delete obj[key];
    } else if (typeof obj[i] == 'object') {
      filterNestedObject(obj[i] as any, key);
    }
  }
  return obj;
}

export function getTodaysName() {
  return format(new Date(), 'EEEE');
}

export function isArray<T>(array: T[]): array is T[] {
  return !!array && Array.isArray(array);
}

export function percentOf(a: number, b: number) {
  if (a > 0 && b > 0) {
    const percent = (a / b) * 100;
    if (percent > 100) {
      return 100;
    } else if (percent < 0) {
      return 0;
    }
    return percent;
  }
  return 0;
}

export function isBoolean(val: any) {
  return typeof val === 'boolean';
}

export function millisToMinsAndSecs(millis: number) {
  let minutes = Math.floor(millis / 60000);
  let seconds = Number(((millis % 60000) / 1000).toFixed(0));
  // let m = (minutes < 10 ? '0' : '') + minutes;
  let m = minutes.toString();
  let s = (seconds < 10 ? '0' : '') + seconds;
  return { minutes: m, seconds: s };
}

export function sortArrayByDate<T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
) {
  return arr.sort((a, b) => {
    if (order === 'desc') {
      return convertToDate(b[key]).getTime() - convertToDate(a[key]).getTime();
    }
    return convertToDate(a[key]).getTime() - convertToDate(b[key]).getTime();
  });
}

export function sortWaitings(waitings: Waiting[]) {
  const canceled = waitings.filter(w => w.is_canceled);
  const dones = waitings.filter(w => w.done && !w.is_canceled);
  const ready = waitings.filter(
    w => w.is_ready && !w.done && !w.is_canceled && !w.serving_now,
  );
  const serving = waitings.filter(
    w => w.serving_now && !w.done && !w.is_canceled,
  );
  const queue = sortArrayByDate(
    waitings.filter(
      w => !w.is_canceled && !w.serving_now && !w.done && !w.is_ready,
    ),
    'created_date',
    'asc',
  );
  return [...serving, ...ready, ...queue, ...dones, ...canceled];
}

export function sortReservations(reservations: Reservation[]) {
  const canceled = reservations.filter(w => w.is_canceled);
  const dones = reservations.filter(w => w.done && !w.is_canceled);
  const ready = reservations.filter(
    w => w.is_ready && !w.done && !w.is_canceled && !w.serving_now,
  );
  const serving = reservations.filter(
    w => w.serving_now && !w.done && !w.is_canceled,
  );
  const queue = sortArrayByDate(
    reservations.filter(
      w => !w.is_canceled && !w.serving_now && !w.done && !w.is_ready,
    ),
    'from',
    'asc',
  );
  return [...serving, ...ready, ...queue, ...dones, ...canceled];
}

export function toFixed(num?: number) {
  const decimal_places = 2;
  num = toNumber(num);
  return Number(
    (
      Math.round(num * Math.pow(10, decimal_places)) /
      Math.pow(10, decimal_places)
    ).toFixed(decimal_places),
  );
}

export function jsonParse<T>(str: string | null | undefined) {
  if (!str) return null;
  try {
    const obj = JSON.parse(str);
    return obj as T;
  } catch {
    return null;
  }
}

/**
 * Converts a time string in the format of "HH:mm" to minutes
 * @param timeString - The time string to convert
 * @returns The time in minutes
 */
export function timeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':');
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

/**
 * Converts a time in minutes to a time string in the format of "HH:mm"
 * @param minutes - The time in minutes to convert
 * @returns The time string in the format of "HH:mm"
 */
export function minutesToTimeString(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${remainingMinutes
    .toString()
    .padStart(2, '0')}`;
}

export const WeekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function isWithinShift(
  shifts: WorkingShifts | undefined,
  timezone?: string,
) {
  let type: 'OPEN' | 'CLOSED' | 'CLOSING_SOON' = 'CLOSED';
  let now = timezone ? utcToZonedTime(new Date(), timezone) : new Date();
  let shift: WorkingShift | undefined;

  if (shifts && Object.keys(shifts).length) {
    const day_name = format(now, 'EEEE');
    if (shifts[day_name] && shifts[day_name].length) {
      shift = shifts[day_name].find(_shift => {
        let start = parse(_shift.from, 'HH:mm', now);
        let end = parse(_shift.to, 'HH:mm', now);
        return isWithinInterval(now, { start, end });
      });
    }
  }

  if (shift) {
    type = 'OPEN';
    // Check if closing soon:
    let end = parse(shift.to, 'HH:mm', now);
    let duration = intervalToDuration({
      start: now,
      end,
    });
    if (duration.hours && duration.hours < 1) {
      type = 'CLOSING_SOON';
    }
  }
  return type;
}

export function isWithinWaitingTimeRange(service: Service, timezone?: string) {
  if (!service || !service?.reservation_time) return true;
  const now = timezone ? utcToZonedTime(new Date(), timezone) : new Date();
  const from = service.reservation_time.from.split(':');
  const to = service.reservation_time.to.split(':');
  let start = set(now, {
    hours: Number(from[0]),
    minutes: Number(from[1]),
    seconds: 0,
  });
  let end = set(now, {
    hours: Number(to[0]),
    minutes: Number(to[1]),
    seconds: 0,
  });
  return isWithinInterval(now, { start, end });
}

export function isLimitByTicketNearEnd(tickets_count: {
  total: number;
  used: number;
}) {
  const percent = (tickets_count.used / tickets_count.total) * 100;
  return percent >= 90 && percent < 100;
}

export function isLimitByTicketEnded(tickets_count: {
  total: number;
  used: number;
}) {
  return tickets_count.used >= tickets_count.total;
}

export function licenseValidity(
  expire_date?: License['expire_date'],
  is_trial?: License['is_trial'],
  tickets_count?: { total: number; used: number } | null,
) {
  const is_expired =
    convertToDate(expire_date).getTime() < new Date().getTime();
  const diff = differenceInCalendarDays(convertToDate(expire_date), new Date());
  const isAlert =
    (is_trial ? 3 : 14) >= diff ||
    (!!tickets_count && isLimitByTicketNearEnd(tickets_count));
  const isHighAlert =
    (is_trial ? 1 : 7) >= diff ||
    (!!tickets_count && isLimitByTicketEnded(tickets_count));
  return {
    diff,
    isEnded:
      is_expired || (!!tickets_count && isLimitByTicketEnded(tickets_count)),
    isAlert,
    isHighAlert,
  };
}

export function getReservationTimes(
  selectedDate: Date,
  duration: number,
  workingShifts: WorkingShifts,
  reservationTime: Service['reservation_time'],
  blockedTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[],
  reservedTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[],
  isRequireEmployee = false,
  employeeTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[] = [],
  ignoreCurrentTime = false,
) {
  const now = new Date();
  const startTime = set(add(startOfDay(selectedDate), { hours: 3 }), {
    seconds: 0,
    milliseconds: 0,
  });
  const endTime = set(add(endOfDay(selectedDate), { hours: 3 }), {
    seconds: 0,
    milliseconds: 0,
  });

  let availableTimes: { start: string; end: string }[] = [];

  // * Generate all the possible time slots for the selected date based on the duration
  let currentSlot = startTime;
  while (
    isBefore(currentSlot, endTime) ||
    currentSlot.getTime() === endTime.getTime()
  ) {
    const start = format(currentSlot, 'HH:mm');
    const addedDate = add(currentSlot, {
      minutes: Number(duration),
    });
    let end = format(addedDate, 'HH:mm');
    currentSlot = addedDate;

    // ? Check if the time slot is after the current time
    if (
      !ignoreCurrentTime &&
      isSameDay(selectedDate, now) &&
      isBefore(currentSlot, now)
    ) {
      continue;
    }

    availableTimes.push({ start, end });
  }

  // * Filter out time slots that overlap with reserved or blocked time slots,
  // * are outside of working shifts, or are outside of service reservation time
  availableTimes = availableTimes.filter(({ start, end }) => {
    let startTime = set(selectedDate, {
      hours: +start.split(':')[0],
      minutes: +start.split(':')[1],
      seconds: 0,
      milliseconds: 0,
    });
    let endTime = set(selectedDate, {
      hours: +end.split(':')[0],
      minutes: +end.split(':')[1],
      seconds: 0,
      milliseconds: 0,
    });

    // ? Check if starting hour is less that 3 AM then add one day:
    if (startTime.getHours() < 3) {
      startTime = add(startTime, { days: 1 });
    }
    if (endTime.getHours() < 3) {
      endTime = add(endTime, { days: 1 });
    }
    if (endTime.getTime() < startTime.getTime()) {
      endTime = add(endTime, { days: 1 });
    }

    // ? Check if the time slot is within the working shift
    const nextDay = add(selectedDate, { days: 1 });
    const isWithinWorkingShift =
      [...(workingShifts?.[format(selectedDate, 'EEEE')] ?? [])].some(
        ({ from, to }) => {
          const start = set(selectedDate, {
            hours: +from.split(':')[0],
            minutes: +from.split(':')[1],
            seconds: 0,
            milliseconds: 0,
          });
          let end = set(selectedDate, {
            hours: +to.split(':')[0],
            minutes: +to.split(':')[1],
            seconds: 0,
            milliseconds: 0,
          });

          // ? Check if time is 11:59 PM then add 1 minute:
          if (format(end, 'HH:mm') === '23:59') {
            end = add(end, { minutes: 1 });
          }

          return (
            isWithinInterval(startTime, { start, end }) &&
            isWithinInterval(endTime, { start, end })
          );
        },
      ) ||
      [...(workingShifts?.[format(nextDay, 'EEEE')] ?? [])].some(
        ({ from, to }) => {
          const start = set(add(selectedDate, { days: 1 }), {
            hours: +from.split(':')[0],
            minutes: +from.split(':')[1],
            seconds: 0,
          });
          let end = set(add(selectedDate, { days: 1 }), {
            hours: +to.split(':')[0],
            minutes: +to.split(':')[1],
            seconds: 0,
          });

          // ? Check if time is 11:59 PM then add 1 minute:
          if (format(end, 'HH:mm') === '23:59') {
            end = add(end, { minutes: 1 });
          }

          return (
            isWithinInterval(startTime, { start, end }) &&
            isWithinInterval(endTime, { start, end })
          );
        },
      );

    // ? Check if the time slot is within the service reservation time
    const isWithinReservationTime = isWithinInterval(selectedDate, {
      start: set(selectedDate, {
        hours: +reservationTime!.from!.split(':')[0],
        minutes: +reservationTime!.from!.split(':')[1],
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(selectedDate, {
        hours: +reservationTime!.to!.split(':')[0],
        minutes: +reservationTime!.to!.split(':')[1],
        seconds: 0,
        milliseconds: 0,
      }),
    });

    // = Check if the custom time is available
    return (
      isWithinWorkingShift &&
      isWithinReservationTime &&
      !isTimeBusy(
        reservedTimes,
        blockedTimes,
        employeeTimes,
        startTime,
        endTime,
        isRequireEmployee,
      )
    );
  });

  // * Format the available times
  let list = availableTimes.map(({ start, end }) => {
    let from = new Date(
      selectedDate.setHours(+start.split(':')[0], +start.split(':')[1], 0, 0),
    );
    let to = new Date(
      selectedDate.setHours(+end.split(':')[0], +end.split(':')[1], 0, 0),
    );

    // ? if time is past midnight then add 1 day
    if (isBefore(from, startTime)) {
      from = add(from, { days: 1 });
    } else if (isBefore(to, startTime)) {
      to = add(to, { days: 1 });
    }

    return { from, to };
  });

  // * Remove duplicates
  list = list.filter((obj, index, self) => {
    return (
      index ===
      self.findIndex(
        t =>
          t.from.getTime() === obj.from.getTime() &&
          t.to.getTime() === obj.to.getTime(),
      )
    );
  });

  // * Sort the list and make past midnight times appear last:
  list = list.sort((a, b) => {
    return a.from.getTime() - b.from.getTime();
  });

  // = Return the list
  return list;
}

export function isTimeAvailable(
  customTime: { from: Date; to: Date },
  blockedTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[],
  reservedTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[],
  isRequireEmployee = false,
  employeeTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[] = [],
): boolean {
  // = Check if the custom time is available
  return !isTimeBusy(
    reservedTimes,
    blockedTimes,
    employeeTimes,
    convertToDate(customTime.from),
    convertToDate(customTime.to),
    isRequireEmployee,
  );
}

export function isTimeBusy(
  reservedTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[],
  blockedTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[],
  employeeTimes: {
    from_date_time: string | null;
    to_date_time: string | null;
  }[],
  start: Date,
  end: Date,
  isRequireEmployee = false,
) {
  // ? Check if the custom time is reserved
  const isReserved = reservedTimes.some(({ from_date_time, to_date_time }) => {
    const reservedStartTime = set(convertToDate(from_date_time!), {
      seconds: 0,
      milliseconds: 0,
    });
    const reservedEndTime = set(convertToDate(to_date_time!), {
      seconds: 0,
      milliseconds: 0,
    });

    const busyWithinReservedTime =
      isWithinInterval(start, {
        start: reservedStartTime,
        end: reservedEndTime,
      }) ||
      isWithinInterval(end, {
        start: reservedStartTime,
        end: reservedEndTime,
      });

    const busyWithinPeriod =
      isWithinInterval(reservedStartTime, {
        start: convertToDate(start),
        end: convertToDate(end),
      }) ||
      isWithinInterval(reservedEndTime, {
        start: convertToDate(start),
        end: convertToDate(end),
      });

    return (
      (busyWithinReservedTime || busyWithinPeriod) &&
      start.getTime() !== reservedEndTime.getTime() &&
      end.getTime() !== reservedStartTime.getTime()
    );
  });

  const isBlocked = blockedTimes.some(({ from_date_time, to_date_time }) => {
    const blockedStartTime = set(convertToDate(from_date_time!), {
      seconds: 0,
      milliseconds: 0,
    });
    const blockedEndTime = set(convertToDate(to_date_time!), {
      seconds: 0,
      milliseconds: 0,
    });

    const busyWithinReservedTime =
      isWithinInterval(start, {
        start: blockedStartTime,
        end: blockedEndTime,
      }) ||
      isWithinInterval(end, {
        start: blockedStartTime,
        end: blockedEndTime,
      });

    const busyWithinPeriod =
      isWithinInterval(blockedStartTime, {
        start: convertToDate(start),
        end: convertToDate(end),
      }) ||
      isWithinInterval(blockedEndTime, {
        start: convertToDate(start),
        end: convertToDate(end),
      });

    return (
      (busyWithinReservedTime || busyWithinPeriod) &&
      start.getTime() !== blockedEndTime.getTime() &&
      end.getTime() !== blockedStartTime.getTime()
    );
  });

  // ? Check if the custom time overlaps with employee times if required
  const isEmployeeBusy =
    isRequireEmployee &&
    employeeTimes.some(({ from_date_time, to_date_time }) => {
      const employeeReservedStartTime = set(convertToDate(from_date_time!), {
        seconds: 0,
        milliseconds: 0,
      });
      const employeeReservedEndTime = set(convertToDate(to_date_time!), {
        seconds: 0,
        milliseconds: 0,
      });

      const busyWithinReservedTime =
        isWithinInterval(start, {
          start: employeeReservedStartTime,
          end: employeeReservedEndTime,
        }) ||
        isWithinInterval(end, {
          start: employeeReservedStartTime,
          end: employeeReservedEndTime,
        });

      const busyWithinPeriod =
        isWithinInterval(employeeReservedStartTime, {
          start: convertToDate(start),
          end: convertToDate(end),
        }) ||
        isWithinInterval(employeeReservedEndTime, {
          start: convertToDate(start),
          end: convertToDate(end),
        });

      return (
        (busyWithinReservedTime || busyWithinPeriod) &&
        start.getTime() !== employeeReservedEndTime.getTime() &&
        end.getTime() !== employeeReservedStartTime.getTime()
      );
    });

  // = Check if the custom time is available
  return isBlocked || isReserved || isEmployeeBusy;
}
