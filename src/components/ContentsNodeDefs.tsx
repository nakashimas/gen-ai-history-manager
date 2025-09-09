import { EDGE_MARKER_WIDTH, NODE_HEIGHT, NODE_WIDTH } from "../utils/constants";

export const ContentsNodeDefs: React.FC = () => (
  <defs>
    {/* マーカー部分 */}
    <marker
      id="edge-arrowhead"
      markerWidth={EDGE_MARKER_WIDTH}
      markerHeight={EDGE_MARKER_WIDTH}
      refX={EDGE_MARKER_WIDTH / 2}
      refY={EDGE_MARKER_WIDTH / 2}
      orient="auto"
      markerUnits="strokeWidth"
    >
      <circle
        cx={EDGE_MARKER_WIDTH / 2}
        cy={EDGE_MARKER_WIDTH / 2}
        r={EDGE_MARKER_WIDTH / 2 - 1}
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <circle
        cx={EDGE_MARKER_WIDTH / 2}
        cy={EDGE_MARKER_WIDTH / 2}
        r={EDGE_MARKER_WIDTH / 4}
        fill="black"
      />
    </marker>
    <marker
      id="edge-arrowhead-disabled"
      markerWidth={EDGE_MARKER_WIDTH}
      markerHeight={EDGE_MARKER_WIDTH}
      refX={EDGE_MARKER_WIDTH / 2}
      refY={EDGE_MARKER_WIDTH / 2}
      orient="auto"
      markerUnits="strokeWidth"
    >
      <circle
        cx={EDGE_MARKER_WIDTH / 2}
        cy={EDGE_MARKER_WIDTH / 2}
        r={EDGE_MARKER_WIDTH / 4}
        fill="black"
      />
    </marker>

    {/* Nodeベース */}
    <rect
      id="node"
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      fill="black"
      stroke="black"
      opacity={0.5}
    />
  </defs>
);
