import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import add from "date-fns/add";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import endOfDay from "date-fns/endOfDay";
import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";
import set from "date-fns/set";
import startOfDay from "date-fns/startOfDay";
import isEqualWith from "lodash.isequalwith";
import {
  License,
  Reservation,
  Service,
  Waiting,
  WorkingShift,
  WorkingShifts,
} from "./taketkt-types";

export function convertToDate(date: any) {
  if (date instanceof Date) {
    return date;
  } else if (typeof date === "string") {
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
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "undefined" || typeof obj[key] === null) {
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
  }
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

export function getInitials(name = "") {
  return name
    .replace(/\s+/, " ")
    .split(" ")
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join("");
}

export function isDeepEqual<T>(objA: T, objB: T) {
  return isEqualWith(objA, objB);
}

export function filterNestedObject<T extends object>(obj: T, key: keyof T) {
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (i == key) {
      delete obj[key];
    } else if (typeof obj[i] == "object") {
      filterNestedObject(obj[i] as any, key);
    }
  }
  return obj;
}

export function getTodaysName() {
  return format(new Date(), "EEEE");
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
  return typeof val === "boolean";
}

export function millisToMinsAndSecs(millis: number) {
  let minutes = Math.floor(millis / 60000);
  let seconds = Number(((millis % 60000) / 1000).toFixed(0));
  // let m = (minutes < 10 ? '0' : '') + minutes;
  let m = minutes.toString();
  let s = (seconds < 10 ? "0" : "") + seconds;
  return { minutes: m, seconds: s };
}

export function sortArrayByDate<T>(
  arr: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
) {
  return arr.sort((a, b) => {
    if (order === "desc") {
      return convertToDate(b[key]).getTime() - convertToDate(a[key]).getTime();
    }
    return convertToDate(a[key]).getTime() - convertToDate(b[key]).getTime();
  });
}

export function sortWaitings(waitings: Waiting[]) {
  const canceled = waitings.filter((w) => w.is_canceled);
  const dones = waitings.filter((w) => w.done && !w.is_canceled);
  const ready = waitings.filter(
    (w) => w.is_ready && !w.done && !w.is_canceled && !w.serving_now
  );
  const serving = waitings.filter(
    (w) => w.serving_now && !w.done && !w.is_canceled
  );
  const queue = sortArrayByDate(
    waitings.filter(
      (w) => !w.is_canceled && !w.serving_now && !w.done && !w.is_ready
    ),
    "created_date",
    "asc"
  );
  return [...serving, ...ready, ...queue, ...dones, ...canceled];
}

export function sortReservations(reservations: Reservation[]) {
  const canceled = reservations.filter((w) => w.is_canceled);
  const dones = reservations.filter((w) => w.done && !w.is_canceled);
  const ready = reservations.filter(
    (w) => w.is_ready && !w.done && !w.is_canceled && !w.serving_now
  );
  const serving = reservations.filter(
    (w) => w.serving_now && !w.done && !w.is_canceled
  );
  const queue = sortArrayByDate(
    reservations.filter(
      (w) => !w.is_canceled && !w.serving_now && !w.done && !w.is_ready
    ),
    "from",
    "asc"
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
    ).toFixed(decimal_places)
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
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function isWithinShift(
  shifts: WorkingShifts | undefined,
  timezone?: string
) {
  let type: "OPEN" | "CLOSED" | "CLOSING_SOON" = "CLOSED";
  let now = timezone ? utcToZonedTime(new Date(), timezone) : new Date();
  let shift: WorkingShift | undefined;

  if (shifts && Object.keys(shifts).length) {
    const day_name = format(now, "EEEE");
    if (shifts[day_name] && shifts[day_name].length) {
      shift = shifts[day_name].find((_shift) => {
        let start = parse(_shift.from, "HH:mm", now);
        let end = parse(_shift.to, "HH:mm", now);
        return isWithinInterval(now, { start, end });
      });
    }
  }

  if (shift) {
    type = "OPEN";
    // Check if closing soon:
    let end = parse(shift.to, "HH:mm", now);
    let duration = intervalToDuration({
      start: now,
      end,
    });
    if (duration.hours && duration.hours < 1) {
      type = "CLOSING_SOON";
    }
  }
  return type;
}

export function isWithinWaitingTimeRange(service: Service, timezone?: string) {
  if (!service || !service?.reservation_time) return true;
  const now = timezone ? utcToZonedTime(new Date(), timezone) : new Date();
  const from = service.reservation_time.from.split(":");
  const to = service.reservation_time.to.split(":");
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
  expire_date?: License["expire_date"],
  is_trial?: License["is_trial"],
  tickets_count?: { total: number; used: number } | null
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
  duration: string,
  workingShifts: WorkingShifts,
  reservationTime: Service["reservation_time"],
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
  ignoreCurrentTime = false
) {
  const now = new Date();
  const startTime = add(startOfDay(selectedDate), { hours: 3 });
  const endTime = add(endOfDay(selectedDate), { hours: 3 });
  const [hours, minutes] = duration.split(":");

  let availableTimes: { start: string; end: string }[] = [];

  // * Generate all the possible time slots for the selected date based on the duration
  let currentSlot = startTime;
  while (
    isBefore(currentSlot, endTime) ||
    currentSlot.getTime() === endTime.getTime()
  ) {
    const start = format(currentSlot, "HH:mm");
    const addedDate = add(currentSlot, {
      hours: Number(hours),
      minutes: Number(minutes),
    });
    const end = format(addedDate, "HH:mm");
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

  // * Add the times for the next working shift if it's between 00:00 and 03:00
  const currentHour = now.getHours();
  if (currentHour >= 0 && currentHour < 3) {
    const nextDay = add(selectedDate, { days: 1 });
    const nextWorkingShift = [
      ...(workingShifts?.[format(selectedDate, "EEEE")] ?? []),
      ...(workingShifts?.[format(nextDay, "EEEE")] ?? []),
    ].find(({ from }) => {
      const shiftStart = parseISO(
        `${format(selectedDate, "yyyy-MM-dd")}T${from}`
      );
      return isAfter(now, shiftStart);
    });
    if (nextWorkingShift) {
      const { from, to } = nextWorkingShift;
      availableTimes.push({ start: from, end: to });
    }
  }

  // * Filter out time slots that overlap with reserved or blocked time slots,
  // * are outside of working shifts, or are outside of service reservation time
  availableTimes = availableTimes.filter(({ start, end }) => {
    let startTime = set(selectedDate, {
      hours: +start.split(":")[0],
      minutes: +start.split(":")[1],
    });
    let endTime = set(selectedDate, {
      hours: +end.split(":")[0],
      minutes: +end.split(":")[1],
    });

    // ? Check if the time slot is within the working shift
    const nextDay = add(selectedDate, { days: 1 });
    const isWithinWorkingShift = [
      ...(workingShifts?.[format(selectedDate, "EEEE")] ?? []),
      ...(workingShifts?.[format(nextDay, "EEEE")] ?? []),
    ].some(({ from, to }) => {
      const start = parseISO(`${format(selectedDate, "yyyy-MM-dd")}T${from}`);
      const end = parseISO(`${format(selectedDate, "yyyy-MM-dd")}T${to}`);
      return (
        (isAfter(startTime, start) ||
          startTime.getTime() === start.getTime()) &&
        (isBefore(endTime, end) || endTime.getTime() === end.getTime())
      );
    });

    // ? Check if the time slot is within the service reservation time
    const isWithinReservationTime =
      (isAfter(
        startTime,
        parseISO(
          `${format(selectedDate, "yyyy-MM-dd")}T${reservationTime?.from}`
        )
      ) ||
        startTime.getTime() ===
          parseISO(
            `${format(selectedDate, "yyyy-MM-dd")}T${reservationTime?.from}`
          ).getTime()) &&
      (isBefore(
        endTime,
        parseISO(`${format(selectedDate, "yyyy-MM-dd")}T${reservationTime?.to}`)
      ) ||
        endTime.getTime() ===
          parseISO(
            `${format(selectedDate, "yyyy-MM-dd")}T${reservationTime?.to}`
          ).getTime());

    // ? Check availability
    const isBlocked = blockedTimes.some(({ from_date_time, to_date_time }) => {
      const blockedStartTime = convertToDate(from_date_time!);
      const blockedEndTime = convertToDate(to_date_time!);
      return (
        ((isAfter(startTime, blockedStartTime) ||
          startTime.getTime() === blockedStartTime.getTime()) &&
          isBefore(startTime, blockedEndTime)) ||
        (isAfter(endTime, blockedStartTime) &&
          (isBefore(endTime, blockedEndTime) ||
            endTime.getTime() === blockedEndTime.getTime())) ||
        (isBefore(startTime, blockedStartTime) &&
          isAfter(endTime, blockedEndTime))
      );
    });

    // Check if the custom time is reserved
    const isReserved = reservedTimes.some(
      ({ from_date_time, to_date_time }) => {
        const reservedStartTime = convertToDate(from_date_time!);
        const reservedEndTime = convertToDate(to_date_time!);
        return (
          ((isAfter(startTime, reservedStartTime) ||
            startTime.getTime() === reservedStartTime.getTime()) &&
            isBefore(startTime, reservedEndTime)) ||
          (isAfter(endTime, reservedStartTime) &&
            (isBefore(endTime, reservedEndTime) ||
              endTime.getTime() === reservedEndTime.getTime())) ||
          (isBefore(startTime, reservedStartTime) &&
            isAfter(endTime, reservedEndTime))
        );
      }
    );

    // Check if the custom time overlaps with employee times if required
    const isEmployeeBusy =
      isRequireEmployee &&
      employeeTimes.some(({ from_date_time, to_date_time }) => {
        const employeeReservedStartTime = convertToDate(from_date_time!);
        const employeeReservedEndTime = convertToDate(to_date_time!);
        return (
          ((isAfter(startTime, employeeReservedStartTime) ||
            startTime.getTime() === employeeReservedStartTime.getTime()) &&
            isBefore(startTime, employeeReservedEndTime)) ||
          (isAfter(endTime, employeeReservedStartTime) &&
            (isBefore(endTime, employeeReservedEndTime) ||
              endTime.getTime() === employeeReservedEndTime.getTime())) ||
          (isBefore(startTime, employeeReservedStartTime) &&
            isAfter(endTime, employeeReservedEndTime))
        );
      });

    // Check if the custom time is available
    return (
      isWithinWorkingShift &&
      isWithinReservationTime &&
      !(isBlocked || isReserved || isEmployeeBusy)
    );
  });

  // * Format the available times
  let list = availableTimes.map(({ start, end }) => {
    let from = new Date(
      selectedDate.setHours(+start.split(":")[0], +start.split(":")[1], 0)
    );
    let to = new Date(
      selectedDate.setHours(+end.split(":")[0], +end.split(":")[1], 0)
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
        (t) =>
          t.from.getTime() === obj.from.getTime() &&
          t.to.getTime() === obj.to.getTime()
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
  }[] = []
): boolean {
  // Convert custom time to Date objects
  const customStartTime = convertToDate(customTime.from);
  const customEndTime = convertToDate(customTime.to);

  // Check if the custom time is blocked
  const isBlocked = blockedTimes.some(({ from_date_time, to_date_time }) => {
    const blockedStartTime = convertToDate(from_date_time!);
    const blockedEndTime = convertToDate(to_date_time!);
    return (
      ((isAfter(customStartTime, blockedStartTime) ||
        customStartTime.getTime() === blockedStartTime.getTime()) &&
        isBefore(customStartTime, blockedEndTime)) ||
      (isAfter(customEndTime, blockedStartTime) &&
        (isBefore(customEndTime, blockedEndTime) ||
          customEndTime.getTime() === blockedEndTime.getTime())) ||
      (isBefore(customStartTime, blockedStartTime) &&
        isAfter(customEndTime, blockedEndTime))
    );
  });

  // Check if the custom time is reserved
  const isReserved = reservedTimes.some(({ from_date_time, to_date_time }) => {
    const reservedStartTime = convertToDate(from_date_time!);
    const reservedEndTime = convertToDate(to_date_time!);
    return (
      ((isAfter(customStartTime, reservedStartTime) ||
        customStartTime.getTime() === reservedStartTime.getTime()) &&
        isBefore(customStartTime, reservedEndTime)) ||
      (isAfter(customEndTime, reservedStartTime) &&
        (isBefore(customEndTime, reservedEndTime) ||
          customEndTime.getTime() === reservedEndTime.getTime())) ||
      (isBefore(customStartTime, reservedStartTime) &&
        isAfter(customEndTime, reservedEndTime))
    );
  });

  // Check if the custom time overlaps with employee times if required
  const isEmployeeBusy =
    isRequireEmployee &&
    employeeTimes.some(({ from_date_time, to_date_time }) => {
      const employeeReservedStartTime = convertToDate(from_date_time!);
      const employeeReservedEndTime = convertToDate(to_date_time!);
      return (
        ((isAfter(customStartTime, employeeReservedStartTime) ||
          customStartTime.getTime() === employeeReservedStartTime.getTime()) &&
          isBefore(customStartTime, employeeReservedEndTime)) ||
        (isAfter(customEndTime, employeeReservedStartTime) &&
          (isBefore(customEndTime, employeeReservedEndTime) ||
            customEndTime.getTime() === employeeReservedEndTime.getTime())) ||
        (isBefore(customStartTime, employeeReservedStartTime) &&
          isAfter(customEndTime, employeeReservedEndTime))
      );
    });

  // Check if the custom time is available
  return !(isBlocked || isReserved || isEmployeeBusy);
}
