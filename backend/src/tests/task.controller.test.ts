import { buildTaskUpdates } from '../controllers/task.util.js'

describe('Task Controller - buildTaskUpdates', () => {
  it("doesn't include assignment when not provided", () => {
    const input = { status: 'COMPLETED' }
    const out = buildTaskUpdates(input as any)
    expect(out).toMatchObject({ status: 'COMPLETED' })
    expect(Object.prototype.hasOwnProperty.call(out, 'assignedToId')).toBe(
      false
    )
  })

  it('includes assignedToId=null when empty string is provided (explicit unassign)', () => {
    const input = { assignedToId: '' }
    const out = buildTaskUpdates(input as any)
    expect(Object.prototype.hasOwnProperty.call(out, 'assignedToId')).toBe(true)
    expect(out.assignedToId).toBeNull()
  })
})
