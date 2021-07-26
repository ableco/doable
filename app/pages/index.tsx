import { BlitzPage, invalidateQuery, useMutation, useQuery } from "blitz";
import Layout from "app/core/layouts/Layout";
import protectPage from "app/core/helpers/protectPage";
import { ListContainer, TextInput } from "@ableco/abledev-components";
import { FormEvent, useState } from "react";
import createTask from "app/tasks/mutations/createTask";
import listTasks from "app/tasks/queries/listTasks";
import TaskComponent from "app/components/Task";

const Home: BlitzPage = () => {
  return (
    <div
      className="mt-14 mx-auto flex flex-col justify-center space-y-4"
      style={{
        // TODO: "width: 500" is not in the normal tailwind classes
        width: 500,
      }}
    >
      <CreateTaskForm />
      <TasksList />
      <p className="text-center">
        <button className="text-gray-400 text-sm cursor-pointer underline">
          Show completed tasks
        </button>
      </p>
    </div>
  );
};

function CreateTaskForm() {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTaskMutation] = useMutation(createTask, {
    onSuccess: () => invalidateQuery(listTasks),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 0) {
      setIsSubmitting(true);
      await createTaskMutation({ description: trimmedDescription });
      setIsSubmitting(false);
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="New task description"
        hideLabel
        className="w-full"
        placeholder="Add a new task..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
    </form>
  );
}

function TasksList() {
  const [tasks] = useQuery(listTasks, {});

  return (
    <div className="w-full">
      <ListContainer variant="simple">
        {tasks.map((task) => {
          return <TaskComponent key={task.id} task={task} />;
        })}
      </ListContainer>
    </div>
  );
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;
Home.suppressFirstRenderFlicker = true;

export const getServerSideProps = protectPage;

export default Home;
