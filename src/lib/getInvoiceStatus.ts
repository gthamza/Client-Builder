export function getInvoiceStatus(currentStatus: string, dueDate: string) {
  if (currentStatus === "paid") return "paid";
  if (currentStatus === "draft") return "draft";

  const due = new Date(dueDate);
  const today = new Date();

  if (currentStatus === "unpaid" && due < today) {
    return "overdue";
  }

  return currentStatus;
}
