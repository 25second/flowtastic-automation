
import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

export const useFlowActions = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  edges: Edge[],
  startWorkflow: (nodes: Node[], edges: Edge[], browser: number) => Promise<void>,
  startRecording: () => void,
  stopRecording: () => Promise<Node[]>
) => {
  const [showScript, setShowScript] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    if (!reactFlowBounds) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode: Node = {
      id: crypto.randomUUID(),
      type: data.type,
      position,
      data: { 
        label: data.label,
        settings: { ...data.settings },
        description: data.description
      },
      style: {
        background: '#fff',
        padding: '15px',
        borderRadius: '8px',
        width: 180,
      },
    };

    setNodes([...nodes, newNode]);
    toast.success('Node added');
  };

  const handleStartWorkflow = (browserPort: number) => {
    startWorkflow(nodes, edges, browserPort)
      .then(() => {
        setShowBrowserDialog(false);
        toast.success('Workflow started successfully');
      })
      .catch((error) => {
        console.error('Error starting workflow:', error);
        toast.error('Failed to start workflow');
      });
  };

  const handleRecordClick = (browserPort: number) => {
    if (isRecording) {
      stopRecording()
        .then((recordedNodes) => {
          if (recordedNodes) {
            setNodes([...nodes, ...recordedNodes]);
            toast.success('Recording added to workflow');
          }
          setIsRecording(false);
          setShowRecordDialog(false);
        })
        .catch((error) => {
          console.error('Error stopping recording:', error);
          toast.error('Failed to stop recording');
        });
    } else {
      startRecording();
      setIsRecording(true);
      setShowRecordDialog(false);
    }
  };

  return {
    showScript,
    setShowScript,
    showAIDialog,
    setShowAIDialog,
    showBrowserDialog,
    setShowBrowserDialog,
    showRecordDialog,
    setShowRecordDialog,
    prompt,
    setPrompt,
    isRecording,
    handleDragOver,
    handleDrop,
    handleStartWorkflow,
    handleRecordClick,
  };
};
