import ModalPage from '../../pages/ModalPage.tsx';
import { Button, Flex } from '@radix-ui/themes';
import Form from '../shared/form/Form.tsx';
import { useGetUsersQuery } from '../../store/api/user.ts';
import { FormEvent, useMemo } from 'react';
import { Pencil2Icon } from '@radix-ui/react-icons';

interface NewTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewTask = ({ open, onOpenChange }: NewTaskProps) => {
  const { data: usersData } = useGetUsersQuery();

  const users = useMemo(() => usersData?.content ?? [], [usersData]);

  const submitNewTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submit new task');
  }

  return (
    <ModalPage
      title="Create New Task"
      description="Fill in the details below to create a new task."
      color="green"
      icon={Pencil2Icon}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form px="2" handleSubmit={submitNewTask}>
        <Form.Content>
          <Form.Input
            name="task title"
            type="text"
            required
            placeholder="Enter task title..."
          />
          <Form.Input
            name="task description"
            type="textarea"
            required
            placeholder="Enter task description..."
          />
          <Form.Select
            name="assignee"
            required
            placeholder="Assignee"
            options={users.map((user) => ({
              label: user.email,
              value: user.id.toString(),
            }))}
          />
        </Form.Content>
        <Flex
          direction="row"
          justify="between"
          align="center"
          gap="2"
          width="100%"
          mt="5"
        >
          <Form.Submit title="Create" color="green" />
          <Button
            type="reset"
            onClick={() => onOpenChange(false)}
            variant="soft"
            color="gray"
            size="4"
          >
            Close
          </Button>
        </Flex>
      </Form>
    </ModalPage>
  );
};

export default NewTask;
