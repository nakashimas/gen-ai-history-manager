import {
  COLOR_BLACK,
  COLOR_WHITE,
  EDGE_MARKER_WIDTH,
  NODE_HEIGHT,
  NODE_WIDTH,
} from "../utils/constants";

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
        fill={COLOR_WHITE}
        stroke={COLOR_BLACK}
        strokeWidth="2"
      />
      <circle
        cx={EDGE_MARKER_WIDTH / 2}
        cy={EDGE_MARKER_WIDTH / 2}
        r={EDGE_MARKER_WIDTH / 4}
        fill={COLOR_BLACK}
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
        fill={COLOR_BLACK}
      />
    </marker>

    {/* Nodeボタン */}
    <g id="node-reproduction" className="cursor-pointer">
      <circle cx={0} cy={0} r={EDGE_MARKER_WIDTH} fill={COLOR_BLACK} />
      <rect
        x={0 - EDGE_MARKER_WIDTH / 4 - 1}
        y={0 - EDGE_MARKER_WIDTH / 4 - 1}
        width={EDGE_MARKER_WIDTH / 2}
        height={EDGE_MARKER_WIDTH / 2}
        fill={COLOR_WHITE}
        rx="1.0"
        opacity="0.8"
      />
      <rect
        x={0 - EDGE_MARKER_WIDTH / 4 + 2}
        y={0 - EDGE_MARKER_WIDTH / 4 + 2}
        width={EDGE_MARKER_WIDTH / 2}
        height={EDGE_MARKER_WIDTH / 2}
        fill={COLOR_WHITE}
        rx="1.0"
        opacity="1"
      />
    </g>

    <g id="node-remove" className="cursor-pointer">
      <circle cx={0} cy={0} r={EDGE_MARKER_WIDTH} fill={COLOR_BLACK} />
      <line
        x1={-EDGE_MARKER_WIDTH / 2}
        y1={-EDGE_MARKER_WIDTH / 2}
        x2={EDGE_MARKER_WIDTH / 2}
        y2={EDGE_MARKER_WIDTH / 2}
        stroke={COLOR_WHITE}
        strokeWidth={EDGE_MARKER_WIDTH / 6}
        strokeLinecap="round"
      />
      <line
        x1={EDGE_MARKER_WIDTH / 2}
        y1={-EDGE_MARKER_WIDTH / 2}
        x2={-EDGE_MARKER_WIDTH / 2}
        y2={EDGE_MARKER_WIDTH / 2}
        stroke={COLOR_WHITE}
        strokeWidth={EDGE_MARKER_WIDTH / 6}
        strokeLinecap="round"
      />
    </g>

    {/* Node背景 */}
    <g id="node-background">
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        fill={COLOR_BLACK}
        opacity={0.5}
        rx={EDGE_MARKER_WIDTH / 4 + 2}
      />
      <rect
        x={EDGE_MARKER_WIDTH / 4}
        y={EDGE_MARKER_WIDTH / 4}
        width={NODE_WIDTH - EDGE_MARKER_WIDTH / 2}
        height={NODE_HEIGHT - EDGE_MARKER_WIDTH / 2}
        fill={COLOR_WHITE}
        rx={EDGE_MARKER_WIDTH / 4}
      />
    </g>
  </defs>
);
