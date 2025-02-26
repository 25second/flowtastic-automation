
import { useState } from 'react';
import { WorkflowFilters } from './list/WorkflowFilters';
import { WorkflowListHeader } from './list/WorkflowListHeader';
import { WorkflowItem } from './list/WorkflowItem';
import { toast } from 'sonner';

interface WorkflowListProps {
  isLoading: boolean;
  workflows: any[] | undefined;
  onDelete: (ids: string[]) => void;
  onEditDetails: (workflow: any) => void;
  onRun: (workflow: any) => void;
}

export const WorkflowList = ({ 
  isLoading, 
  workflows, 
  onDelete, 
  onEditDetails,
  onRun 
}: WorkflowListProps) => {
  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  const filteredWorkflows = workflows?.filter(workflow => {
    if (!workflow) return false;

    const name = workflow.name?.toLowerCase() || '';
    const description = workflow.description?.toLowerCase() || '';
    const tags = workflow.tags || [];

    const nameMatch = name.includes(nameFilter.toLowerCase());
    const descriptionMatch = !descriptionFilter || description.includes(descriptionFilter.toLowerCase());
    const tagMatch = !tagFilter || tags.some((tag: string) => 
      tag.toLowerCase().includes(tagFilter.toLowerCase())
    );

    return nameMatch && descriptionMatch && tagMatch;
  });

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows?.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows?.map(w => w.id) || []);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedWorkflows.length === 0) {
      toast.error("Please select workflows to delete");
      return;
    }
    onDelete(selectedWorkflows);
    setSelectedWorkflows([]);
  };

  if (isLoading) {
    return <p>Loading workflows...</p>;
  }

  return (
    <div className="space-y-4">
      <WorkflowFilters
        nameFilter={nameFilter}
        descriptionFilter={descriptionFilter}
        tagFilter={tagFilter}
        onNameFilterChange={setNameFilter}
        onDescriptionFilterChange={setDescriptionFilter}
        onTagFilterChange={setTagFilter}
      />

      <WorkflowListHeader
        selectedCount={selectedWorkflows.length}
        totalCount={filteredWorkflows?.length || 0}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleBulkDelete}
      />

      <div className="grid gap-4">
        {filteredWorkflows?.map((workflow) => (
          <WorkflowItem
            key={workflow.id}
            workflow={workflow}
            isSelected={selectedWorkflows.includes(workflow.id)}
            onSelect={handleSelect}
            onEditDetails={onEditDetails}
            onDelete={onDelete}
            onRun={onRun}
          />
        ))}
      </div>

      {(!filteredWorkflows || filteredWorkflows.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          {workflows && workflows.length > 0 
            ? 'No workflows found matching your filters'
            : 'No workflows found'}
        </div>
      )}
    </div>
  );
};
