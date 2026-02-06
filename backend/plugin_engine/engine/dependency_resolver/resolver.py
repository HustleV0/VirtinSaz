from typing import List, Dict, Set

class DependencyResolver:
    def __init__(self, plugin_registry):
        self.registry = plugin_registry

    def resolve(self, required_plugins: List[str]) -> List[str]:
        """
        Resolves dependencies and returns plugins in activation order (topological sort).
        """
        graph = {}
        to_process = list(required_plugins)
        processed = set()

        while to_process:
            plugin_slug = to_process.pop(0)
            if plugin_slug in processed:
                continue
            
            manifest = self.registry.get_manifest(plugin_slug)
            if not manifest:
                raise ValueError(f"Manifest for plugin {plugin_slug} not found")
            
            dependencies = manifest.get('dependencies', {}).get('plugins', [])
            graph[plugin_slug] = dependencies
            processed.add(plugin_slug)
            
            for dep in dependencies:
                if dep not in processed:
                    to_process.append(dep)

        return self._topological_sort(graph)

    def _topological_sort(self, graph: Dict[str, List[str]]) -> List[str]:
        result = []
        visited = set()
        temp_visited = set()

        def visit(node):
            if node in temp_visited:
                raise ValueError(f"Circular dependency detected at {node}")
            if node not in visited:
                temp_visited.add(node)
                for neighbor in graph.get(node, []):
                    visit(neighbor)
                temp_visited.remove(node)
                visited.add(node)
                result.append(node)

        for node in graph:
            if node not in visited:
                visit(node)
        
        return result
