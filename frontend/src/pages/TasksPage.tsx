import { Flex } from '@radix-ui/themes';
import TasksListTitle from '../components/tasks/TasksListTitle.tsx';
import TasksContent from '../components/tasks/TasksContent.tsx';
import { useGetTasksQuery } from '../store/api/task.ts';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '0';
  const { data: taskData } = useGetTasksQuery({ page: Number.parseInt(page) });

  const tasks = useMemo(() => taskData?.content ?? [], [taskData]);

  return (
    <Flex direction="column" flexGrow="1" p="4" gap="6">
      <TasksListTitle totalTasks={tasks.length} />
      <TasksContent tasks={tasks} />
    </Flex>
  );
};

export default TasksPage;
