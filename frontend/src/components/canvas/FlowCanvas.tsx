import React, { useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Edge, 
  Node, 
  OnNodesChange, 
  NodeTypes 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { QNodeCard } from './QNodeCard';
import { useCanvasStore } from '../../store/canvasStore';
import { FloatingCanvasToolbar } from '../trido/FloatingCanvasToolbar';

const nodeTypes: NodeTypes = {
  qnode: QNodeCard,
};

export const FlowCanvas: React.FC = () => {
  const { nodes: qNodes, updateNodePosition, selectNode } = useCanvasStore();

  const flowNodes: Node[] = useMemo(() => {
    return qNodes.map((n) => ({
      id: n.id,
      type: 'qnode',
      position: n.position,
      data: n as unknown as Record<string, unknown>,
    }));
  }, [qNodes]);

  const flowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    qNodes.forEach((n) => {
      if (n.parentId) {
        edges.push({
          id: `edge-${n.parentId}-${n.id}`,
          source: n.parentId,
          target: n.id,
          type: 'default',
          animated: n.status === 'loading',
          style: { 
            stroke: n.status === 'loading' ? '#1859c9' : '#cbd5e1', 
            strokeWidth: 2,
          },
        });
      }
    });
    return edges;
  }, [qNodes]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          updateNodePosition(change.id, change.position);
        }
      });
    },
    [updateNodePosition]
  );

  return (
    <div className="w-full h-full p-3 bg-[#f1f3f6] flex flex-col relative select-none">
      {/* The Rounded Canvas Board (Matches exact Trido canvas border and rounded frame) */}
      <div className="w-full h-full rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden relative">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={(_, node) => selectNode(node.id)}
          fitView
          fitViewOptions={{ padding: 0.28 }}
          minZoom={0.35}
          maxZoom={1.6}
          defaultEdgeOptions={{
            type: 'default',
          }}
        >
          {/* Trido Styled Grid Dots */}
          <Background gap={28} size={1.25} color="#cbd5e1" />
        </ReactFlow>

        {/* Floating Vertical Toolbar (Inside the board on the left) */}
        <FloatingCanvasToolbar />
      </div>
    </div>
  );
};
