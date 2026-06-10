import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RankedSkill } from "@/lib/schemas";

function levelLabel(avgLevel: number) {
  if (avgLevel >= 2.67) {
    return "must-have";
  }

  if (avgLevel >= 1.67) {
    return "required";
  }

  return "nice-to-have";
}

export function SkillTable({ skills }: { skills: RankedSkill[] }) {
  if (skills.length === 0) {
    return <p className="text-sm text-stone-600">No ranked skills yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Skill</TableHead>
          <TableHead className="w-24">Count</TableHead>
          <TableHead className="w-36">Avg level</TableHead>
          <TableHead>Sample evidence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((skill) => (
          <TableRow key={skill.skill}>
            <TableCell className="font-medium text-stone-950">{skill.skill}</TableCell>
            <TableCell>{skill.count}</TableCell>
            <TableCell>
              <Badge>{levelLabel(skill.avgLevel)}</Badge>
              <div className="mt-1 text-xs text-stone-500">{skill.avgLevel.toFixed(2)}</div>
            </TableCell>
            <TableCell className="max-w-xl text-stone-700">
              <ul className="space-y-1">
                {skill.sampleEvidence.map((evidence) => (
                  <li key={evidence}>{evidence}</li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
