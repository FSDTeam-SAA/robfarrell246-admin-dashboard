import { ArrowRight } from "lucide-react";

const analyses = [
  {
    name: "Sarah Jenkins, CCIM",
    email: "sarah.jenkins@austinretail.com",
    type: "Property",
    score: "76/100",
    completed: false,
  },
  {
    name: "Marcus Vance",
    email: "marcus@vancehospitality.com",
    type: "Business",
    score: "91/100",
    completed: true,
  },
  {
    name: "Elena Rostova",
    email: "elena@dallascreadvisors.com",
    type: "Property",
    score: "84/100",
    completed: true,
  },
  {
    name: "David Chen",
    email: "david@matchacraft.com",
    type: "Property",
    score: "76/100",
    completed: true,
  },
] as const;

const RecentAnalyses = () => {
  return (
    <section className="overflow-hidden rounded-md border border-[#C9D7E8] bg-white shadow-[0_2px_6px_rgba(24,39,75,0.03)]">
      <header className="flex h-[76px] items-center justify-between px-7 sm:px-[28px]">
        <h2 className="text-[25px] font-semibold tracking-[-0.02em] text-[#131B2E]">
          Recent Analyses
        </h2>
        <a
          href="/analyses"
          className="inline-flex items-center gap-1 text-[15px] font-medium text-[#1F64FF] transition hover:text-[#0B4DE2]"
        >
          View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
        </a>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <thead className="bg-[#E7ECF4] text-left">
            <tr className="h-[70px] text-[18px] font-medium text-[#303A4C]">
              <th className="w-[32%] px-7 font-medium">User</th>
              <th className="w-[24%] px-4 font-medium">Type</th>
              <th className="w-[22%] px-4 font-medium">Fit Score</th>
              <th className="w-[22%] px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((analysis) => {
              const isHighScore = Number.parseInt(analysis.score, 10) >= 90;

              return (
                <tr key={analysis.email} className="h-[94px] border-t border-[#D8DEE8] text-[#192238]">
                  <td className="px-7 py-3">
                    <p className="max-w-[255px] truncate text-[18px] font-medium leading-5">{analysis.name}</p>
                    <p className="mt-1 max-w-[255px] truncate text-[15px] leading-none text-[#5B6980]">{analysis.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[18px] text-[#3A4050]">{analysis.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-lg px-3 py-1 text-[16px] font-medium leading-4 ${isHighScore ? "bg-[#EDFCF2] text-[#08A94E]" : "bg-[#EEF7FF] text-[#2858F6]"}`}>
                      {analysis.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-[16px] font-medium leading-4 ${analysis.completed ? "bg-[#EDFCF2] text-[#08A94E]" : "bg-[#EEF7FF] text-[#2858F6]"}`}>
                      <span className={`h-3 w-3 rounded-full ${analysis.completed ? "bg-[#08A94E]" : "bg-[#2858F6]"}`} />
                      {analysis.completed ? "Completed" : "In Progress"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentAnalyses;
