import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import { ProjectionViewer } from "./components/ProjectionViewer";
import { CategoryBalance } from "./components/CategoryBalance";
import { EventModal } from "./components/EventModal";
import { CategoryModal } from "./components/CategoryModal";

export default function App() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Financial Calendar</h2>
        <div className="flex gap-4 items-center">
          <Authenticated>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Manage Categories
            </button>
          </Authenticated>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 p-8">
        <Content showCategoryModal={showCategoryModal} setShowCategoryModal={setShowCategoryModal} />
      </main>
      <Toaster />
    </div>
  );
}

function Content({ showCategoryModal, setShowCategoryModal }: { showCategoryModal: boolean, setShowCategoryModal: (show: boolean) => void }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const events = useQuery(api.events.list) || [];
  const categories = useQuery(api.categories.list) || [];
  const updateEvent = useMutation(api.events.update);
  const removeEvent = useMutation(api.events.remove);
  const createEvent = useMutation(api.events.create);
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showSpendingCap, setShowSpendingCap] = useState(false);
  const [projectionCategory, setProjectionCategory] = useState<any>(null);
  const [projectionDate, setProjectionDate] = useState<string>("");

  // Handle direct links to projections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#projection=')) {
        const [categoryId, date] = hash.slice(11).split(',');
        const category = categories.find(c => c._id === categoryId);
        if (category) {
          setProjectionCategory(category);
          setProjectionDate(date);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial hash
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const calendarEvents = events.map(event => ({
    id: event._id,
    title: `${event.title} ($${event.amount})`,
    start: event.date,
    backgroundColor: event.type === 'income' ? '#4ade80' : '#ef4444',
    classNames: event.enabled ? [] : ['opacity-50'],
    extendedProps: { event },
  }));

  const handleEventDrop = (info: any) => {
    updateEvent({
      id: info.event.id as Id<"events">,
      date: info.event.startStr,
    });
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (info: any) => {
    const event = info.event.extendedProps.event;
    setEditingEvent(event);
    setSelectedDate(event.date);
    setShowEventModal(true);
  };

  const handleProjectClick = (category: any) => {
    setProjectionCategory(category);
    // Default to end of current month if no date selected
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const date = endOfMonth.toISOString().split('T')[0];
    setProjectionDate(date);
    // Update URL for sharing
    window.location.hash = `projection=${category._id},${date}`;
  };

  const handleSubmitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const categoryId = formData.get('categoryId');
    
    if (typeof categoryId !== 'string') return;

    try {
      if (editingEvent) {
        await updateEvent({
          id: editingEvent._id,
          title: formData.get('title') as string,
          amount: Number(formData.get('amount')),
          date: selectedDate,
          description: formData.get('description') as string,
          categoryId: categoryId as Id<"categories">,
        });
        toast.success('Event updated successfully');
      } else {
        await createEvent({
          title: formData.get('title') as string,
          amount: Number(formData.get('amount')),
          date: selectedDate,
          type: formData.get('type') as string,
          description: formData.get('description') as string,
          categoryId: categoryId as Id<"categories">,
          ...(formData.get('recurring') === 'on' && {
            recurrence: {
              frequency: formData.get('frequency') as string,
              endDate: formData.get('endDate') as string || undefined,
            },
          }),
        });
        toast.success('Event created successfully');
      }
    } catch (error) {
      toast.error('Failed to save event');
    }
    
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
    
    try {
      await removeEvent({ id: editingEvent._id });
      toast.success('Event deleted successfully');
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleToggleEvent = async (event: any) => {
    try {
      await updateEvent({
        id: event._id,
        enabled: !event.enabled,
      });
      toast.success(event.enabled ? 'Event disabled' : 'Event enabled');
    } catch (error) {
      toast.error('Failed to toggle event');
    }
  };

  const handleSubmitCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const parentId = formData.get('parentId');
    const hasSpendingCap = formData.get('hasSpendingCap') === 'on';
    
    const spendingCap = hasSpendingCap ? {
      amount: Number(formData.get('capAmount')),
      period: formData.get('capPeriod') as string,
    } : undefined;
    
    if (editingCategory) {
      updateCategory({
        id: editingCategory._id,
        name: formData.get('name') as string,
        parentId: parentId ? (parentId as Id<"categories">) : undefined,
        spendingCap,
      });
    } else {
      createCategory({
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        parentId: parentId ? (parentId as Id<"categories">) : undefined,
        spendingCap,
      });
    }
    
    setEditingCategory(null);
  };

  const getCategoryOptions = (type: string) => {
    return categories
      .filter(cat => cat.type === type)
      .map(cat => (
        <option key={cat._id} value={cat._id}>
          {cat.parentId ? '↳ ' : ''}{cat.name}
        </option>
      ));
  };

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <div className="bg-white rounded-lg shadow p-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            editable={true}
            eventDrop={handleEventDrop}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="text-center">
          <p className="text-xl text-slate-600">Sign in to access your financial calendar</p>
          <SignInForm />
        </div>
      </Unauthenticated>

      {showEventModal && (
        <EventModal
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSubmit={handleSubmitEvent}
          onDelete={handleDeleteEvent}
          onToggle={handleToggleEvent}
          selectedDate={selectedDate}
          getCategoryOptions={getCategoryOptions}
          editingEvent={editingEvent}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSubmit={handleSubmitCategory}
          categories={categories}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          showSpendingCap={showSpendingCap}
          setShowSpendingCap={setShowSpendingCap}
          onProjectClick={handleProjectClick}
        />
      )}

      {projectionCategory && (
        <ProjectionViewer
          category={projectionCategory}
          date={projectionDate}
          setDate={setProjectionDate}
          onClose={() => {
            setProjectionCategory(null);
            window.location.hash = '';
          }}
        />
      )}
    </div>
  );
}
