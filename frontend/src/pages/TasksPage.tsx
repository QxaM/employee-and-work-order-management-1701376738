import { Flex } from '@radix-ui/themes';
import TasksListTitle from '../components/tasks/TasksListTitle.tsx';

const TasksPage = () => {
  return (
    <Flex direction="column" flexGrow="1" p="4" gap="6">
      <TasksListTitle totalTasks={2} />
    </Flex>
  );
};

export default TasksPage;
