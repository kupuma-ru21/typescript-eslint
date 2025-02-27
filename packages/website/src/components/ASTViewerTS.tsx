import React, { useEffect, useState } from 'react';

import ASTViewer from './ast/ASTViewer';
import type { ASTViewerBaseProps, ASTViewerModelMap } from './ast/types';
import type { SourceFile } from 'typescript';
import { serialize } from './ast/serializer/serializer';
import { createTsSerializer } from './ast/serializer/serializerTS';

export interface ASTTsViewerProps extends ASTViewerBaseProps {
  readonly value: SourceFile | string;
}

function extractEnum(
  obj: Record<number, string | number>,
): Record<number, string> {
  const result: Record<number, string> = {};
  const keys = Object.entries(obj);
  for (const [name, value] of keys) {
    if (typeof value === 'number') {
      if (!(value in result)) {
        result[value] = name;
      }
    }
  }
  return result;
}

export default function ASTViewerTS({
  value,
  position,
  onSelectNode,
}: ASTTsViewerProps): JSX.Element {
  const [model, setModel] = useState<string | ASTViewerModelMap>('');
  const [syntaxKind] = useState(() => extractEnum(window.ts.SyntaxKind));
  const [nodeFlags] = useState(() => extractEnum(window.ts.NodeFlags));
  const [tokenFlags] = useState(() => extractEnum(window.ts.TokenFlags));
  const [modifierFlags] = useState(() => extractEnum(window.ts.ModifierFlags));
  const [objectFlags] = useState(() => extractEnum(window.ts.ObjectFlags));
  const [symbolFlags] = useState(() => extractEnum(window.ts.SymbolFlags));
  const [flowFlags] = useState(() => extractEnum(window.ts.FlowFlags));
  const [typeFlags] = useState(() => extractEnum(window.ts.TypeFlags));

  useEffect(() => {
    if (typeof value === 'string') {
      setModel(value);
    } else {
      const scopeSerializer = createTsSerializer(
        value,
        syntaxKind,
        ['NodeFlags', nodeFlags],
        ['TokenFlags', tokenFlags],
        ['ModifierFlags', modifierFlags],
        ['ObjectFlags', objectFlags],
        ['SymbolFlags', symbolFlags],
        ['FlowFlags', flowFlags],
        ['TypeFlags', typeFlags],
      );
      setModel(serialize(value, scopeSerializer));
    }
  }, [value, syntaxKind]);

  return (
    <ASTViewer position={position} onSelectNode={onSelectNode} value={model} />
  );
}
