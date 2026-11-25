import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, mergeIntervals, periodMonths, totalExperienceMonths } from './experience.ts';
import { formatMonthYear, formatRange } from './dates.ts';

const NOW = new Date(Date.UTC(2026, 10, 15)); // 15 Nov 2026

test('single closed role counts inclusive months', () => {
  assert.equal(totalExperienceMonths([{ start: '2020-01-01', end: '2020-12-31' }], NOW), 12);
});

test('overlapping roles are not double counted', () => {
  const months = totalExperienceMonths(
    [
      { start: '2020-01-01', end: '2021-12-01' }, // 24 months
      { start: '2021-06-01', end: '2022-05-01' }, // overlaps 7 months, adds 5
    ],
    NOW,
  );
  assert.equal(months, 29);
});

test('fully nested freelance role adds nothing', () => {
  const months = totalExperienceMonths(
    [
      { start: '2019-01', end: '2022-12' },
      { start: '2020-03', end: '2020-09' },
    ],
    NOW,
  );
  assert.equal(months, 48);
});

test('gaps between roles are excluded', () => {
  const months = totalExperienceMonths(
    [
      { start: '2018-01', end: '2018-06' }, // 6
      { start: '2019-01', end: '2019-03' }, // 3
    ],
    NOW,
  );
  assert.equal(months, 9);
});

test('adjacent roles merge cleanly', () => {
  assert.deepEqual(
    mergeIntervals([
      [10, 12],
      [13, 20],
    ]),
    [[10, 20]],
  );
});

test('current role runs until now; future months are ignored', () => {
  assert.equal(totalExperienceMonths([{ start: '2026-01', current: true }], NOW), 11);
  assert.equal(totalExperienceMonths([{ start: '2026-06', end: '2027-12' }], NOW), 6);
  assert.equal(totalExperienceMonths([{ start: '2027-01', current: true }], NOW), 0);
});

test('missing end date is treated as ongoing', () => {
  assert.equal(periodMonths({ start: '2026-09' }, NOW), 3);
});

test('end before start is ignored', () => {
  assert.equal(totalExperienceMonths([{ start: '2022-01', end: '2021-01' }], NOW), 0);
});

test('year-only dates cover whole years', () => {
  assert.equal(totalExperienceMonths([{ start: '2019', end: '2020' }], NOW), 24);
});

test('duration formatting', () => {
  assert.equal(formatDuration(40), '3 yrs 4 mos');
  assert.equal(formatDuration(12), '1 yr');
  assert.equal(formatDuration(1), '1 mo');
  assert.equal(formatDuration(0), '');
});

test('date formatting', () => {
  assert.equal(formatMonthYear('2023-04-01'), 'Apr 2023');
  assert.equal(formatMonthYear('2023'), '2023');
  assert.equal(formatRange('2021-04', undefined, true), 'Apr 2021 – Present');
  assert.equal(formatRange('2019', '2021', false, { yearOnly: true }), '2019 – 2021');
});
