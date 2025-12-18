export function buildTaskUpdates(data: any) {
  const updates: any = {
    status: data.status,
    priority: data.priority,
  }

  if ('assignedToId' in data) {
    if (data.assignedToId && data.assignedToId.trim() !== '') {
      updates.assignedToId = data.assignedToId
    } else {
      updates.assignedToId = null
    }
  }

  return updates
}
