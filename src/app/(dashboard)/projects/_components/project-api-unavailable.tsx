import { CircleAlert } from "lucide-react";

export function ProjectApiUnavailable({ title, message }: { title: string; message: string }) {
  return (
    <section className="m-3 overflow-hidden rounded-[5px] border border-[#CBD7E6] bg-white sm:m-4 lg:m-6">
      <header className="border-b border-[#DCE5EF] p-3">
        <h2 className="text-[14px] font-bold text-[#151D30]">{title}</h2>
      </header>
      <div className="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">
        <CircleAlert className="h-6 w-6 text-[#7C8AA0]" />
        <p className="mt-3 max-w-lg text-[11px] leading-5 text-[#65758C]">{message}</p>
      </div>
    </section>
  );
}
