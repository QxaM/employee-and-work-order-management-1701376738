import { Box, Container, Grid, Heading, Section, Text } from '@radix-ui/themes';
import NavCard from '../../components/shared/NavCard.tsx';
import PersonGearIcon from '../../components/icons/PersonGearIcon.tsx';

/**
 * AdminPage is a functional React component that represents the main
 * layout for an admin section in the application. It combines a sidebar
 * for navigation (AdminSidebar) and dynamic content rendering (Outlet).
 *
 * It is designed to serve as a container for admin-related views.
 */
const AdminPage = () => {
  return (
    <Container align="center" height="100%" my="6">
      <Section
        height="100%"
        px="4"
        className="bg-(--gray-1) rounded-(--radius-2) shadow-(--shadow-2)"
      >
        <Box mb="6">
          <Heading as="h2" size="4" mb="2">
            Navigate to one of the following pages
          </Heading>
          <Text size="2" color="gray">
            Select a section to manage different aspects of your application
          </Text>
        </Box>
        <Grid gap="4" columns={{ initial: '1', sm: '2', md: '3' }}>
          <NavCard
            to="/admin/roles-update"
            title="Roles Update"
            description="View and update users' roles"
            icon={PersonGearIcon}
          />
        </Grid>
      </Section>
    </Container>
  );
};

export default AdminPage;
