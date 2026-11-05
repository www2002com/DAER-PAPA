import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { findApproval, recordApproval, requireApproval } from '../src/approvals.mjs';

test('승인은 대상 해시에 묶이고, 파일이 바뀌면 무효다', async () => {
  const ledger = path.join(await mkdtemp(path.join(tmpdir(), 'dp-')), 'ledger.jsonl');
  await assert.rejects(requireApproval('plan', 'H1', 'aaa', ledger), /기획서 승인/);
  await recordApproval({ gate: 'plan', subject: 'H1', hash: 'aaa', by: 'AUTHON' }, ledger);
  assert.equal((await requireApproval('plan', 'H1', 'aaa', ledger)).by, 'AUTHON');
  assert.equal(await findApproval('plan', 'H1', 'bbb', ledger), null);
  assert.equal(await findApproval('sample', 'H1', 'aaa', ledger), null);
});

test('승인자 이름과 알려진 승인 지점이 필요하다', async () => {
  const ledger = path.join(await mkdtemp(path.join(tmpdir(), 'dp-')), 'ledger.jsonl');
  await assert.rejects(recordApproval({ gate: 'plan', subject: 'H1', hash: 'a', by: ' ' }, ledger), /승인자/);
  await assert.rejects(recordApproval({ gate: 'budget', subject: 'H1', hash: 'a', by: 'x' }, ledger), /승인 지점/);
});
