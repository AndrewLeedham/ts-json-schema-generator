import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { getKey } from "../Utils/nodeKey";

export class FunctionDeclarationTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.FunctionDeclaration): boolean {
        return node.kind === ts.SyntaxKind.FunctionDeclaration;
    }
    public createType(node: ts.FunctionDeclaration, context: Context): BaseType {
        return new ObjectType(
            this.getTypeId(node, context),
            [],
            this.getParameters(node, context),
            false,
        );
    }

    private getParameters(node: ts.FunctionDeclaration, context: Context): ObjectProperty[] {
        return node.parameters.map(paramNode => {
            return new ObjectProperty(
                paramNode.name.getText(),
                this.childNodeParser.createType(paramNode.type!, context),
                !paramNode.questionToken,
            );
        });
    }

    private getTypeId(node: ts.Node, context: Context): string {
        return `function-${getKey(node, context)}`;
    }
}
