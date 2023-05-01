export interface TodoTask {
  body: TodoTaskBody;
  bodyLastModifiedDateTime: DateTimeOffset;
  categories: string[];
  completedDateTime: DateTimeTimeZone;
  createdDateTime: DateTimeOffset;
  dueDateTime: DateTimeTimeZone;
  hasAttachments: boolean;
  id: string;
  importance: "low" | "normal" | "high";
  isReminderOn: boolean;
  lastModifiedDateTime: DateTimeOffset;
  recurrence: PatternedRecurrence;
  reminderDateTime: DateTimeTimeZone;
  startDateTime: DateTimeTimeZone;
  status: "notStarted" | "inProgress" | "completed" | "waitingOnOthers" | "deferred";
  title: string;
}

type DateTimeOffset = string;
interface DateTimeTimeZone {
  dateTime: DateTimeOffset;
  timeZone: string;
}
interface TodoTaskBody {
  content: string;
  contentType: "text" | "html";
}
interface PatternedRecurrence {
  pattern: RecurrencePattern;
  range: RecurrenceRange;
}
type DaysOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
interface RecurrencePattern {
  dayOfMonth?: number;
  daysOfWeek?: DaysOfWeek[];
  firstDayOfWeek?: DaysOfWeek;
  index?: "first" | "second" | "third" | "fourth" | "last";
  interval: number;
  month?: number;
  type: "daily" | "weekly" | "absoluteMonthly" | "relativeMonthly" | "absoluteYearly" | "relativeYearly";
}
interface RecurrenceRange {
  // "endDate" and "numberOfOccurrences" are mutually exclusive
  endDate?: string;
  numberOfOccurrences?: number;
  recurrenceTimeZone?: string;
  startDate: string; // Timestamp
  type: "noEnd" | "endDate" | "numberOfOccurrences";
}
