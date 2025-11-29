import { TaskType } from '../../types/api/TaskTypes.ts';
import { Flex } from '@radix-ui/themes';
import TaskCard from './TaskCard.tsx';

interface TasksContentProps {
  tasks: TaskType[];
}

const TasksContent = ({ tasks }: TasksContentProps) => {
  return (
    <Flex direction="column" gap="2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Flex>
  );
};

export default TasksContent;
