import { Flex } from '@radix-ui/themes';
import TasksListTitle from '../components/tasks/TasksListTitle.tsx';
import TasksContent from '../components/tasks/TasksContent.tsx';
import { useGetTasksQuery } from '../store/api/task.ts';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pageable as PageableData } from '../types/components/PageableTypes.ts';
import Pageable from '../components/shared/pageable/Pageable.tsx';
import NewTask from '../components/tasks/NewTask.tsx';

const TasksPage = () => {
  const [isNewTaskOpened, setIsNewTaskOpened] = useState(false);

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '0';
  const { data: taskData } = useGetTasksQuery({ page: Number.parseInt(page) });

  const tasks = useMemo(() => taskData?.content ?? [], [taskData]);

  const pageable: PageableData = {
    isFirst: taskData?.first ?? true,
    isLast: taskData?.last ?? true,
    currentPage: taskData?.number ?? 0,
    totalPages: taskData?.totalPages ?? 0,
    currentElements: taskData?.numberOfElements ?? 0,
    totalElements: taskData?.totalElements ?? 0,
    pageSize: taskData?.size ?? 0,
  };

  return (
    <>
      <Flex direction="column" flexGrow="1" p="4" gap="6">
        <TasksListTitle
          totalTasks={tasks.length}
          openNewTask={() => { setIsNewTaskOpened(true); }}
        />
        <TasksContent tasks={tasks} />
        <Pageable pageable={pageable} />
      </Flex>
      <NewTask open={isNewTaskOpened} onOpenChange={setIsNewTaskOpened} />
    </>
  );
};

export default TasksPage;
