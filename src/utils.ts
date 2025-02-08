import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import isWithinInterval from 'date-fns/isWithinInterval';
import parse from 'date-fns/parse';
import set from 'date-fns/set';
import isEqualWith from 'lodash.isequalwith';
import {
  License,
  Reservation,
  Service,
  Ticket,
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
  return x === undefined || x === null || isNaN(Number(x)) ? 0 : Number(x);
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

export function absoluteNumber(num: any) {
  let _num = Math.abs(toNumber(num));
  return _num > 0 ? _num : 0;
}

export function sumArray(arr: number[]) {
  return arr.reduce((acc, val) => toNumber(acc) + toNumber(val), 0);
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

export function isLimitByTicketNearEnd(
  tickets_count?: {
    total: number;
    used: number;
  } | null,
) {
  if (!tickets_count?.total) return false;
  const percent = (tickets_count.used / tickets_count.total) * 100;
  return percent >= 90 && percent < 100;
}

export function isLimitByTicketEnded(
  tickets_count?: {
    total: number;
    used: number;
  } | null,
) {
  if (!tickets_count?.total) return false;
  return tickets_count.used >= tickets_count.total;
}

export function licenseValidity(
  expire_date?: License['expire_date'],
  is_trial?: License['is_trial'],
  tickets_count?: { total: number; used: number } | null,
) {
  const is_expired = !expire_date
    ? false
    : convertToDate(expire_date).getTime() < new Date().getTime();
  const diff = differenceInCalendarDays(convertToDate(expire_date), new Date());
  const isAlert =
    (!!expire_date && (is_trial ? 3 : 14) >= diff) ||
    isLimitByTicketNearEnd(tickets_count);
  const isHighAlert =
    (!!expire_date && (is_trial ? 1 : 7) >= diff) ||
    isLimitByTicketEnded(tickets_count);
  const isEnded = is_expired || isLimitByTicketEnded(tickets_count);

  return {
    diff: expire_date ? diff : 0,
    isEnded,
    isAlert,
    isHighAlert,
  };
}

export function isWaiting(
  ticket: Ticket | Partial<Ticket> | null | undefined,
): ticket is Waiting {
  return !!ticket && 'waiting_id' in ticket;
}

export function isReservation(
  ticket: Ticket | Partial<Ticket> | null | undefined,
): ticket is Reservation {
  return !!ticket && 'reservation_id' in ticket;
}
