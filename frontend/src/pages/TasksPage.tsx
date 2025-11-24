import { Flex } from '@radix-ui/themes';
import TasksListTitle from '../components/tasks/TasksListTitle.tsx';
import TasksContent from '../components/tasks/TasksContent.tsx';
import { useGetTasksQuery } from '../store/api/task.ts';
import { useMemo } from 'react';

const TasksPage = () => {
  const { data: taskData } = useGetTasksQuery();

  const tasks = useMemo(() => taskData ?? [], [taskData]);

  return (
    <Flex direction="column" flexGrow="1" p="4" gap="6">
      <TasksListTitle totalTasks={tasks.length} />
      <TasksContent tasks={tasks} />
    </Flex>
  );
};

export default TasksPage;
