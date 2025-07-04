const statusDisplays: Record<string, string> = {
  "pending": "Pendente",
  "skipped": "Perdida",
  "completed": "Concluída"
};


export default function formatStatusDisplay(status: string): string {
  return statusDisplays[status];
}