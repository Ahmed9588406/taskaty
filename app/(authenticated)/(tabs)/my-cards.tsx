import { View, Text, StyleSheet, FlatList, Pressable, Modal, Image } from "react-native";
import Toast from 'react-native-toast-message';
import { useSupabase } from "@/context/SupabaseContext";
import { useEffect, useState } from "react";
import { Board, Task, TaskList } from "@/types/enums";
import { Colors } from "@/constants/Colors";

interface TaskWithRelations extends Task {
    due_date: string | null;
    boards?: Board;
    lists?: TaskList;
    image_url?: string;
    signedImageUrl?: string; // Add this property
}

const Page = () => {
    const { userId, getUserCards } = useSupabase();
    const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null);

    useEffect(() => {
        loadUserCards();
    }, [userId]);

    const loadUserCards = async () => {
        if (!userId || !getUserCards) return;
        const data = await getUserCards(userId);
        // Add signed URLs to the tasks
        const tasksWithImages = await Promise.all(
            data.map(async (task) => {
                if (task.image_url) {
                    const signedUrl = await getFileFromPath!(task.image_url);
                    return { ...task, signedImageUrl: signedUrl };
                }
                return task;
            })
        );
        setTasks(tasksWithImages);
    };

    const getStatusColor = (task: TaskWithRelations) => {
        if (task.done) return '#4CAF50'; // Success color
        
        // Assuming you have a due_date field in your cards table
        if (task.due_date && typeof task.due_date === 'string' && new Date(task.due_date) < new Date()) {
            return '#F44336'; // Error color
        }
        
        return Colors.primary;
    };

    const getStatusText = (task: TaskWithRelations) => {
        if (task.done) return "Completed";
        if (task.due_date && typeof task.due_date === 'string' && new Date(task.due_date) < new Date()) {
            return "Delayed";
        }
        return "In Progress";
    };

    const showToast = (status: 'done' | 'in_progress' | 'delayed') => {
        const toastConfig = {
            done: {
                type: 'success',
                text1: 'Task Completed',
                text2: 'Great job! Task marked as done',
                position: 'bottom',
            },
            in_progress: {
                type: 'info',
                text1: 'Task In Progress',
                text2: 'Task is now in active progress',
                position: 'bottom'
            },
            delayed: {
                type: 'error',
                text1: 'Task Delayed',
                text2: 'Task has been marked as delayed',
                position: 'bottom',
            },
        };

        const config = toastConfig[status];
        Toast.show(config);
    };

    const handleStatusChange = async (newStatus: 'done' | 'in_progress' | 'delayed') => {
        if (!selectedTask) return;
        
        // Create a new task object with updated properties
        const updatedTask = {
            ...selectedTask,
            done: newStatus === 'done',
            due_date: newStatus === 'delayed' ? new Date().toISOString() : null
        };
        // Update the tasks array with the new status
        
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === selectedTask.id ? {
                    ...task,
                    done: updatedTask.done,
                    due_date: updatedTask.due_date
                } : task
            )
        );

        showToast(newStatus);
        setSelectedTask(null);
    };

    const renderTaskModal = () => (
        <Modal
            visible={!!selectedTask}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSelectedTask(null)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{selectedTask?.title}</Text>
                    {selectedTask?.description && (
                        <Text style={styles.modalDescription}>{selectedTask.description}</Text>
                    )}
                    <View style={styles.statusButtons}>
                        <Pressable 
                            style={[styles.statusButton, { backgroundColor: '#4CAF50' }]}
                            onPress={() => handleStatusChange('done')}
                        >
                            <Text style={styles.statusButtonText}>Done</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.statusButton, { backgroundColor: Colors.primary }]}
                            onPress={() => handleStatusChange('in_progress')}
                        >
                            <Text style={styles.statusButtonText}>In Progress</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.statusButton, { backgroundColor: '#F44336' }]}
                            onPress={() => handleStatusChange('delayed')}
                        >
                            <Text style={styles.statusButtonText}>Delayed</Text>
                        </Pressable>
                    </View>
                    <Pressable 
                        style={styles.closeButton}
                        onPress={() => setSelectedTask(null)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );

    const renderCard = ({ item }: { item: TaskWithRelations }) => (
        <Pressable 
            style={styles.card}
            onPress={() => setSelectedTask(item)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.boardName}>{item.boards?.title}</Text>
                <View style={[styles.status, { backgroundColor: getStatusColor(item) }]}>
                    <Text style={styles.statusText}>{getStatusText(item)}</Text>
                </View>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.signedImageUrl && (
                <Image
                    source={{ uri: item.signedImageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
            )}
            {item.description && (
                <Text style={[styles.description, item.signedImageUrl && styles.descriptionWithImage]}>
                    {item.description}
                </Text>
            )}
            <Text style={styles.listName}>List: {item.lists?.title}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            
            <FlatList
                data={tasks}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
            {renderTaskModal()}
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        gap: 12,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    boardName: {
        fontSize: 12,
        color: Colors.grey,
    },
    status: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardImage: {
        width: '100%',
        height: 200, // Made taller
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: '#f0f0f0', // Add placeholder color
    },
    descriptionWithImage: {
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 8,
    },
    listName: {
        fontSize: 12,
        color: Colors.grey,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 16,
        color: Colors.grey,
        marginBottom: 16,
    },
    statusButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statusButton: {
        padding: 8,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
        elevation: 2, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    statusButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
    closeButton: {
        padding: 12,
        backgroundColor: Colors.grey,
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default Page;