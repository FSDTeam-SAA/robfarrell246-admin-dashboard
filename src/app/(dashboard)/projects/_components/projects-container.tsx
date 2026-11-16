"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Eye, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import { useDeletePropertyAnalysis, usePropertyAnalyses, type DashboardProject } from "./projects-api";
import ProjectDetail from "./project-detail";

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);
  return debouncedValue;
}

const ProjectsContainer = () => {
  const [query, setQuery] = useState("");
  const [analysisType, setAnalysisType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query);
  const projectsQuery = usePropertyAnalyses({ page, search: debouncedQuery });
  const deleteProject = useDeletePropertyAnalysis();
  const projects = projectsQuery.data?.projects ?? [];

  useEffect(() => setPage(1), [debouncedQuery]);

  const analysisTypes = useMemo(() => Array.from(new Set(projects.map((project) => project.spaceType).filter((type) => type !== "—"))), [projects]);
  const visibleProjects = analysisType === "ALL" ? projects : projects.filter((project) => project.spaceType === analysisType);
  const totalPages = projectsQuery.data?.totalPages ?? 1;

  const removeProject = async (project: DashboardProject) => {
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete project");
    }
  };

  if (selectedProjectId) return <ProjectDetail projectId={selectedProjectId} onBack={() => setSelectedProjectId(null)} />;

  return <section className="p-4 sm:p-6">
    <div className="overflow-hidden rounded-[3px] border border-[#E0E7F0] bg-white">
      <div className="flex min-h-[46px] flex-col justify-between gap-3 bg-[#2948B4] px-3 py-2 sm:flex-row sm:items-center sm:px-3.5">
        <label className="relative block w-full sm:w-[250px]"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77849A]" strokeWidth={1.6} /><input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." aria-label="Search projects" className="h-[24px] w-full rounded-[3px] border-0 bg-white py-1 pl-7 pr-9 text-[11px] text-[#26364D] outline-none placeholder:text-[#8A96A8] focus:ring-2 focus:ring-white/60" />{query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear project search" className="absolute right-1.5 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded text-[#64748B] hover:bg-[#EEF2F7] hover:text-[#27364B]"><X className="h-3 w-3" strokeWidth={2.5} /></button> : <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-[#D7DEE8] bg-[#F7F9FC] px-1 py-px text-[8px] text-[#7E8999]">⌘K</kbd>}</label>
        <label className="flex items-center justify-end gap-2 text-[11px] text-white"><span>Analysis Type:</span><span className="relative"><select value={analysisType} onChange={(event) => setAnalysisType(event.target.value)} aria-label="Filter by analysis type" className="h-[24px] appearance-none rounded-[3px] border-0 bg-white py-1 pl-2 pr-6 text-[10px] text-[#344054] outline-none"><option value="ALL">All Analysis Types ({projectsQuery.data?.total ?? 0})</option>{analysisTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select><ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#526174]" /></span></label>
      </div>

      {projectsQuery.isLoading ? <div className="p-4"><ApiLoadingSkeleton rows={5} /></div> : projectsQuery.isError ? <div className="p-4"><ApiErrorState message={projectsQuery.error.message} onRetry={() => projectsQuery.refetch()} /></div> : !projects.length ? <div className="p-4"><ApiEmptyState message="No projects found." /></div> : <><div className="overflow-x-auto"><table className="w-full min-w-[1020px] border-collapse text-left"><thead className="bg-[#E6EBF3] text-[10px] font-medium text-[#4F5E73]"><tr className="h-[36px]"><th className="w-[25%] px-4 font-medium">PROJECT / ADDRESS</th><th className="w-[15%] px-3 text-center font-medium">Broker</th><th className="w-[16%] px-3 font-medium">Space Type</th><th className="w-[12%] px-3 text-center font-medium">Square Footage</th><th className="w-[11%] px-3 text-center font-medium">Base Rent</th><th className="w-[11%] px-3 text-center font-medium">STATUS</th><th className="w-[10%] px-3 text-center font-medium">Action</th></tr></thead><tbody>{visibleProjects.map((project) => <ProjectRow key={project.id} project={project} isDeleting={deleteProject.isPending} onDetails={() => setSelectedProjectId(project.id)} onDelete={() => removeProject(project)} />)}{visibleProjects.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-[12px] text-[#718097]">No projects match this analysis type.</td></tr>}</tbody></table></div><footer className="flex min-h-[48px] items-center justify-between gap-3 border-t border-[#E5EAF1] px-3.5 py-2 text-[10px] text-[#526174]"><span>{projectsQuery.data?.total ?? 0} requests · Page {page} of {totalPages}</span><div className="flex items-center gap-1.5"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55"><ChevronLeft className="h-3 w-3" />Prev</button><span className="inline-flex h-[25px] min-w-[22px] items-center justify-center rounded-[3px] bg-[#EEF2F7] px-1.5 text-[10px]">{page}</span><button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55">Next<ChevronRight className="h-3 w-3" /></button></div></footer></>}
    </div>
  </section>;
};

const ProjectRow = ({ project, isDeleting, onDetails, onDelete }: { project: DashboardProject; isDeleting: boolean; onDetails: () => void; onDelete: () => void }) => <tr className="h-[52px] border-b border-[#E5EAF1] last:border-b-0"><td className="px-4 py-2"><p className="truncate text-[12px] font-medium leading-4 text-[#27364B]">{project.address}</p><p className="truncate text-[10px] leading-3 text-[#728096]">{project.location}</p></td><td className="px-3 py-2 text-center"><p className="truncate text-[12px] font-medium leading-4 text-[#27364B]">{project.broker}</p><p className="truncate text-[10px] leading-3 text-[#728096]">{project.email}</p></td><td className="px-3 py-2 text-[12px] font-medium text-[#27364B]">{project.spaceType}</td><td className="px-3 py-2 text-center text-[12px] font-medium text-[#27364B]">{project.squareFootage}</td><td className="px-3 py-2 text-center text-[12px] font-medium text-[#27364B]">{project.baseRent}</td><td className="px-3 py-2 text-center"><span className="inline-flex items-center gap-1 rounded bg-[#EAFBF1] px-1.5 py-0.5 text-[9px] font-medium text-[#0AA656]"><span className="h-1.5 w-1.5 rounded-full bg-[#0AB85D]" />{project.status}</span></td><td className="px-3 py-2"><div className="flex items-center justify-center gap-2"><button type="button" onClick={onDetails} aria-label={`View details for ${project.address}`} className="inline-flex h-[25px] items-center gap-2 rounded-[2px] bg-[#F1F4F8] px-3 text-[12px] font-medium text-[#27364B] transition hover:bg-[#E5EAF1]"><Eye className="h-3.5 w-3.5" strokeWidth={1.7} />Details</button><button type="button" disabled={isDeleting} onClick={onDelete} aria-label={`Delete ${project.address}`} className="inline-flex h-[25px] w-[34px] items-center justify-center rounded-[2px] bg-[#FFF2F4] text-[#E5262A] transition hover:bg-[#FFE4E7] disabled:opacity-50"><Trash2 className="h-3 w-3" strokeWidth={1.8} /></button></div></td></tr>;

export default ProjectsContainer;
