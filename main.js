/**
 * ALETHEIA.OS - Core Application Logic
 * Implements view switching and the advanced Knowledge Canvas engine.
 */

class AletheiaPlatform {
  constructor() {
    this.initNavigation();
    
    // Canvas State
    this.nodes = [];
    this.links = [];
    this.canvasSurface = document.getElementById('canvas-surface');
    this.linksSvg = document.getElementById('canvas-links');
    
    // Canvas Interaction State
    this.isDraggingNode = false;
    this.draggedNode = null;
    this.dragOffset = { x: 0, y: 0 };
    
    this.isLinking = false;
    this.linkStartNode = null;
    
    this.selectedLink = null;
    
    this.initCanvasEvents();
    
    // Load initial mock nodes
    this.loadMockCanvas();
  }

  // --- NAVIGATION ---
  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Reset nav styles
        navItems.forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');
        
        // Switch view
        const targetView = e.target.getAttribute('data-target');
        if (targetView) this.switchView(targetView);
      });
    });
  }

  switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    const target = document.getElementById(viewId);
    if(target) target.classList.add('active');
  }

  // --- CANVAS ENGINE: NODES ---
  addNode(type, x = window.innerWidth / 2 + (this.canvasSurface.parentElement.scrollLeft) - 100, 
                y = window.innerHeight / 2 + (this.canvasSurface.parentElement.scrollTop) - 100) {
    const id = 'node_' + Date.now();
    const nodeData = { id, type, x, y, width: 220, height: 100 };
    
    // Specific configs based on type
    let headerText = 'TEXT NOTE';
    let bodyContent = '<div class="node-body" contenteditable="true">Enter text...</div>';
    
    if (type === 'verse') {
      headerText = 'JOHN 1:1';
      nodeData.width = 280;
      bodyContent = `<div class="node-body">In the beginning was the Word, and the Word was with God, and the Word was God.</div>`;
    } else if (type === 'pdf') {
      headerText = 'RESOURCE';
      nodeData.width = 200;
      bodyContent = `<div class="node-body" style="text-align:center; font-weight:bold;">📄 Targum_Analysis.pdf</div>`;
    }

    const nodeEl = document.createElement('div');
    nodeEl.className = `canvas-node type-${type}`;
    nodeEl.id = id;
    nodeEl.style.left = `${x}px`;
    nodeEl.style.top = `${y}px`;
    
    nodeEl.innerHTML = `
      <div class="node-header">
        <span>${headerText}</span>
        <span style="cursor:pointer;" onclick="app.deleteNode('${id}')">✕</span>
      </div>
      ${bodyContent}
    `;

    // Attach drag events to header
    const headerEl = nodeEl.querySelector('.node-header');
    headerEl.addEventListener('mousedown', (e) => this.startNodeDrag(e, nodeData, nodeEl));
    
    // Attach linking logic
    nodeEl.addEventListener('mousedown', (e) => {
      if (e.shiftKey) {
        e.preventDefault(); // Prevent text selection
        this.startLink(nodeData);
      }
    });
    nodeEl.addEventListener('mouseup', (e) => {
      if (this.isLinking && this.linkStartNode.id !== id) {
        this.finishLink(nodeData);
      }
    });

    this.nodes.push(nodeData);
    this.canvasSurface.appendChild(nodeEl);
    return nodeData;
  }

  deleteNode(id) {
    this.nodes = this.nodes.filter(n => n.id !== id);
    this.links = this.links.filter(l => l.source !== id && l.target !== id);
    const el = document.getElementById(id);
    if(el) el.remove();
    this.renderLinks();
  }

  // --- CANVAS ENGINE: DRAGGING ---
  startNodeDrag(e, nodeData, nodeEl) {
    if (e.shiftKey) return; // Shift is reserved for linking
    this.isDraggingNode = true;
    this.draggedNode = { data: nodeData, el: nodeEl };
    
    const rect = nodeEl.getBoundingClientRect();
    const surfaceRect = this.canvasSurface.getBoundingClientRect();
    
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // --- CANVAS ENGINE: LINKING ---
  startLink(nodeData) {
    this.isLinking = true;
    this.linkStartNode = nodeData;
  }

  finishLink(targetNodeData) {
    const typeSelect = document.getElementById('link-type-select').value;
    const dirSelect = document.getElementById('link-dir-select').value;
    
    this.links.push({
      id: 'link_' + Date.now(),
      source: this.linkStartNode.id,
      target: targetNodeData.id,
      type: typeSelect,
      direction: dirSelect
    });
    
    this.isLinking = false;
    this.linkStartNode = null;
    this.renderLinks();
  }

  // --- CANVAS ENGINE: GLOBAL EVENTS ---
  initCanvasEvents() {
    // Surface Mouse Move
    this.canvasSurface.addEventListener('mousemove', (e) => {
      if (this.isDraggingNode) {
        const surfaceRect = this.canvasSurface.getBoundingClientRect();
        
        // Calculate new position relative to surface
        let newX = e.clientX - surfaceRect.left - this.dragOffset.x;
        let newY = e.clientY - surfaceRect.top - this.dragOffset.y;
        
        // Grid snap (20px)
        newX = Math.round(newX / 20) * 20;
        newY = Math.round(newY / 20) * 20;

        this.draggedNode.data.x = newX;
        this.draggedNode.data.y = newY;
        this.draggedNode.el.style.left = `${newX}px`;
        this.draggedNode.el.style.top = `${newY}px`;
        
        this.renderLinks();
      }
      
      if (this.isLinking) {
        // Draw temporary link line to mouse pointer
        const surfaceRect = this.canvasSurface.getBoundingClientRect();
        const mouseX = e.clientX - surfaceRect.left;
        const mouseY = e.clientY - surfaceRect.top;
        this.renderLinks(mouseX, mouseY);
      }
    });

    // Surface Mouse Up
    window.addEventListener('mouseup', () => {
      this.isDraggingNode = false;
      this.draggedNode = null;
      if (this.isLinking) {
        this.isLinking = false;
        this.linkStartNode = null;
        this.renderLinks(); // clear temp line
      }
    });
  }

  // --- CANVAS ENGINE: RENDERING LINKS ---
  renderLinks(tempX = null, tempY = null) {
    // Clear current SVG, preserving defs
    const defs = this.linksSvg.querySelector('defs').outerHTML;
    let svgContent = defs;

    // Render confirmed links
    this.links.forEach(link => {
      const sourceNode = this.nodes.find(n => n.id === link.source);
      const targetNode = this.nodes.find(n => n.id === link.target);
      if(!sourceNode || !targetNode) return;

      const pathData = this.calculateBezierPath(sourceNode, targetNode);
      const midPoint = this.calculateMidpoint(sourceNode, targetNode);
      
      const arrowAttr = link.direction === 'uni' ? 'marker-end="url(#arrowhead)"' : '';
      
      // The Link Path
      svgContent += `<path id="${link.id}" class="canvas-link-path ${link.type.split(' ')[0]}" d="${pathData}" ${arrowAttr} onclick="app.selectLink('${link.id}')"></path>`;
      
      // Label Background & Text
      if (link.type !== 'none') {
        const textWidth = link.type.length * 7;
        svgContent += `
          <rect x="${midPoint.x - textWidth/2}" y="${midPoint.y - 8}" width="${textWidth}" height="16" class="canvas-link-label-bg"></rect>
          <text x="${midPoint.x}" y="${midPoint.y + 3}" class="canvas-link-label">${link.type.toUpperCase()}</text>
        `;
      }
    });

    // Render temp link if actively drawing
    if (this.isLinking && this.linkStartNode && tempX !== null) {
      const sx = this.linkStartNode.x + this.linkStartNode.width / 2;
      const sy = this.linkStartNode.y + this.linkStartNode.height / 2;
      const pathData = `M ${sx} ${sy} L ${tempX} ${tempY}`;
      svgContent += `<path class="canvas-link-path" style="stroke-dasharray: 5 5;" d="${pathData}"></path>`;
    }

    this.linksSvg.innerHTML = svgContent;
  }

  // Advanced Bezier Routing between nodes
  calculateBezierPath(nodeA, nodeB) {
    const ax = nodeA.x + (document.getElementById(nodeA.id).offsetWidth / 2);
    const ay = nodeA.y + (document.getElementById(nodeA.id).offsetHeight / 2);
    const bx = nodeB.x + (document.getElementById(nodeB.id).offsetWidth / 2);
    const by = nodeB.y + (document.getElementById(nodeB.id).offsetHeight / 2);

    // Simple horizontal dominant s-curve
    const dist = Math.abs(bx - ax) * 0.5;
    return `M ${ax} ${ay} C ${ax + dist} ${ay}, ${bx - dist} ${by}, ${bx} ${by}`;
  }

  calculateMidpoint(nodeA, nodeB) {
    const ax = nodeA.x + (document.getElementById(nodeA.id).offsetWidth / 2);
    const ay = nodeA.y + (document.getElementById(nodeA.id).offsetHeight / 2);
    const bx = nodeB.x + (document.getElementById(nodeB.id).offsetWidth / 2);
    const by = nodeB.y + (document.getElementById(nodeB.id).offsetHeight / 2);
    return { x: (ax + bx) / 2, y: (ay + by) / 2 };
  }
  
  selectLink(id) {
    // UI feedback for link selection (could map to delete functionality)
    console.log("Selected Link ID:", id);
  }

  // --- MOCK DATA ---
  loadMockCanvas() {
    // Pre-populate canvas to demonstrate capabilities
    const n1 = this.addNode('verse', 1000, 1000);
    const n2 = this.addNode('text', 1400, 1000);
    const n3 = this.addNode('pdf', 1400, 1200);

    // Modify DOM for mock data directly for visual effect
    document.querySelector(`#${n2.id} .node-body`).innerText = "Logos conceptually links to the Jewish Memra (Word of God) which was an agent of creation.";
    
    this.links.push({
      id: 'mock_link_1',
      source: n1.id,
      target: n2.id,
      type: 'Explains',
      direction: 'uni'
    });
    this.links.push({
      id: 'mock_link_2',
      source: n3.id,
      target: n2.id,
      type: 'Supports',
      direction: 'none'
    });
    
    this.renderLinks();
    
    // Center canvas loosely
    this.canvasSurface.parentElement.scrollLeft = 800;
    this.canvasSurface.parentElement.scrollTop = 800;
  }
}

// Initialize Application
const app = new AletheiaPlatform();
