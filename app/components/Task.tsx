import { Avatar, CheckboxInput } from "@abledotdev/ui";
import toggleTask from "app/tasks/mutations/toggleTask";
import listTasks, { ListedTask } from "app/tasks/queries/listTasks";
import { invalidateQuery, useMutation } from "blitz";
// import { DueDate } from "@ableco/job-request--due-date";
// import "@ableco/job-request--due-date/dist/styles.css";

function Task({ task }: { task: ListedTask }) {
  const [toggleTaskMutation] = useMutation(toggleTask, {
    onSuccess: () => invalidateQuery(listTasks),
  });

  const toggleCompletion = () => {
    toggleTaskMutation({ id: task.id });
  };

  return (
    <div className="flex justify-between">
      <CheckboxInput
        label={task.description}
        checked={!!task.completedAt}
        onChange={toggleCompletion}
        description={
          <span className="block text-xs text-gray-400 mt-1">
            {/* <DueDate
              task={task}
              onSuccess={() => {
                invalidateQuery(listTasks);
              }}
            /> */}
          </span>
        }
      />
      <Avatar
        variant="circular"
        size="base"
        src={task.assignedUser?.picture ?? undefined}
        alt="Avatar"
        placeholder={<Avatar.PlaceholderInitials initials="AP" />}
      />
    </div>
  );
}

export default Task;
