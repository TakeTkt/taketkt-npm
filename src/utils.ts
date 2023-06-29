import format from 'date-fns/format';
import type { GeoPoint } from 'firebase/firestore';
import isEqualWith from 'lodash.isequalwith';
import {
  License,
  Reservation,
  ReservationDay,
  Service,
  Waiting,
  WorkingShift,
  WorkingShifts,
} from './taketkt-types';
import set from 'date-fns/set';
import isBefore from 'date-fns/isBefore';
import add from 'date-fns/add';
import getDay from 'date-fns/getDay';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import isWithinInterval from 'date-fns/isWithinInterval';
import parse from 'date-fns/parse';
import intervalToDuration from 'date-fns/intervalToDuration';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

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
  location?: GeoPoint & { _latitude?: number; _longitude?: number },
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

export function getReservationDayHours(
  service: Service,
  workingShifts: WorkingShifts,
  date: Date,
  reservationDates: ReservationDay[],
) {
  const now = new Date();
  const thisDay = WeekDays[date.getDay()];

  let allTimes: { from: Date; to: Date }[] = [];

  if (service?.duration && service?.reservation_time && workingShifts) {
    const thisDayWorkingShift = workingShifts[thisDay].map(shift => {
      const start = shift.from.split(':');
      const end = shift.to.split(':');
      return {
        from: set(date, {
          hours: Number(start[0]),
          minutes: Number(start[1]),
          seconds: 0,
        }),
        to: set(date, {
          hours: Number(end[0]),
          minutes: Number(end[1]),
          seconds: 0,
        }),
      };
    });

    const duration = service.duration.split(':');
    const start = service.reservation_time.from.split(':');
    const end = service.reservation_time.to.split(':');

    let startTime = set(date, {
      hours: Number(start[0]),
      minutes: Number(start[1]),
      seconds: 0,
    });
    let endTime = set(date, {
      hours: Number(end[0]),
      minutes: Number(end[1]),
      seconds: 0,
    });

    if (isBefore(endTime, startTime)) {
      endTime = add(endTime, {
        days: 1,
      });
    }

    while (isBefore(startTime, endTime)) {
      const time = new Date(startTime);
      const is_reserved = (reservationDates ?? []).some(d => {
        const reserved_times = d.reserved_times ?? [];
        const blocked_times = d.blocked_times ?? [];
        const all_times = [...reserved_times, ...blocked_times];
        return (
          all_times.includes(format(time, 'HH:mm')) &&
          d.day === getDay(date) &&
          d.month === getMonth(date) + 1 &&
          d.year === getYear(date)
        );
      });

      const isBetween = thisDayWorkingShift.some(s =>
        isWithinInterval(time, { start: s.from, end: s.to }),
      );
      if (!is_reserved && time >= now && isBetween) {
        allTimes.push({
          from: time,
          to: add(time, {
            hours: Number(duration[0]),
            minutes: Number(duration[1]),
          }),
        });
      }
      const added_hours = Number(duration[0]);
      const added_minutes = Number(duration[1]);
      startTime = add(startTime, {
        hours: added_hours,
        minutes: added_minutes,
      });
    }
  }

  return allTimes;
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
      diff <= 0 || (!!tickets_count && isLimitByTicketEnded(tickets_count)),
    isAlert,
    isHighAlert,
  };
}
