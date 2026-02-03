document.addEventListener('DOMContentLoaded', () => {
    initConnections();
    window.addEventListener('resize', debounce(initConnections, 200));

    // Interaction Logic
    setupInteractions();
});

function setupInteractions() {
    const highlight = (ids, colorClass) => {
        // Reset all
        document.querySelectorAll('.detail-box, .connector-label, .central-hub > div, .main-title-block').forEach(el => {
            el.style.opacity = '0.3';
            el.style.filter = 'grayscale(80%)';
        });
        document.querySelectorAll('.connection-path').forEach(el => el.style.opacity = '0.1');

        // Highlight specific
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.opacity = '1';
                el.style.filter = 'none';
            }
        });

        // Highlight paths connecting these IDs
        // This is a simplified "light up everything" approach for the demo
        // Ideally we would track path IDs
        document.querySelectorAll('.connection-path').forEach(path => {
            // Check if path connects two highlighted elements
            const from = path.getAttribute('data-from');
            const to = path.getAttribute('data-to');
            if (ids.includes(from) && ids.includes(to)) {
                path.style.opacity = '1';
                path.classList.add('active');
            }
        });
    };

    const reset = () => {
        document.querySelectorAll('*').forEach(el => {
            el.style.opacity = '';
            el.style.filter = '';
        });
        document.querySelectorAll('.connection-path').forEach(el => {
            el.style.opacity = '';
            el.classList.remove('active');
        });
    };

    // Define flows for legend items
    const flows = {
        'legend-1': ['hub-sync', 'label-sync-req', 'box-detail-http', 'main-title-box'],
        'legend-2': ['hub-async', 'label-async-req', 'box-detail-async', 'main-title-box'],
        'legend-3': ['main-title-box', 'label-shared', 'box-detail-shared'],
        'legend-4': ['main-title-box', 'label-event', 'box-detail-event']
    };

    Object.keys(flows).forEach(legendId => {
        const el = document.getElementById(legendId);
        if (el) {
            el.addEventListener('mouseenter', () => highlight(flows[legendId]));
            el.addEventListener('mouseleave', reset);
        }
    });
}

function initConnections() {
    const svg = document.getElementById('connections');
    svg.innerHTML = '';

    // Markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', '0 0, 10 3.5, 0 7');
    poly.setAttribute('fill', '#94a3b8');
    marker.appendChild(poly);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // -- Draw Specific Paths --

    // 1. Title Box -> Labels (Shared, Event)
    drawPath('main-title-box', 'label-shared', { type: 'branch-top' });
    drawPath('main-title-box', 'label-event', { type: 'branch-top' });

    // 2. Hub Async -> Label Async
    drawPath('hub-async', 'label-async-req', { type: 'right-to-bottom' });

    // 3. Hub Sync -> Label Sync
    drawPath('hub-sync', 'label-sync-req', { type: 'right-straight' });

    // 4. Labels -> Details (Upward)
    drawPath('label-shared', 'box-detail-shared', { type: 'bottom-to-top' });
    drawPath('label-event', 'box-detail-event', { type: 'bottom-to-top' });
    drawPath('label-async-req', 'box-detail-async', { type: 'bottom-to-top' });

    // 5. Label Sync -> HTTP Detail (Down/Right)
    drawPath('label-sync-req', 'box-detail-http', { type: 'top-to-bottom' });
}

function drawPath(fromId, toId, type) {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);
    if (!fromEl || !toEl) return;

    const svg = document.getElementById('connections');
    const containerRect = document.querySelector('.diagram-grid').getBoundingClientRect();
    const fR = fromEl.getBoundingClientRect();
    const tR = toEl.getBoundingClientRect();

    // Relative coords
    const getCenter = (r) => ({ x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top });
    const getTop = (r) => ({ x: r.left + r.width / 2 - containerRect.left, y: r.top - containerRect.top });
    const getBottom = (r) => ({ x: r.left + r.width / 2 - containerRect.left, y: r.bottom - containerRect.top });
    const getRight = (r) => ({ x: r.right - containerRect.left, y: r.top + r.height / 2 - containerRect.top });
    const getLeft = (r) => ({ x: r.left - containerRect.left, y: r.top + r.height / 2 - containerRect.top });

    let d = '';

    if (type.type === 'branch-top') {
        const start = getTop(fR);
        const end = getBottom(tR);
        // Curve Upwards
        // Control points: Start -> Up, End -> Down
        const cp1y = start.y - 50;
        const cp2y = end.y + 50;
        d = `M ${start.x} ${start.y} C ${start.x} ${cp1y}, ${end.x} ${cp2y}, ${end.x} ${end.y}`;
    }
    else if (type.type === 'bottom-to-top') {
        const s = getTop(fR);
        const e = getBottom(tR);
        d = `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
    }
    else if (type.type === 'right-to-bottom') {
        // Hub Async (Blue) -> Label Async (Pink)
        const s = { x: fR.right - containerRect.left, y: fR.top - containerRect.top + 20 }; // Approx Top-Right of Circle side
        const e = getBottom(tR);
        d = `M ${s.x} ${s.y} C ${s.x + 50} ${s.y}, ${e.x} ${e.y + 50}, ${e.x} ${e.y}`;
    }
    else if (type.type === 'right-straight') {
        const s = getRight(fR);
        const e = getLeft(tR);
        d = `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
    }
    else if (type.type === 'top-to-bottom') {
        const s = getBottom(fR);
        const e = getTop(tR);
        d = `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'connection-path');
    path.setAttribute('data-from', fromId);
    path.setAttribute('data-to', toId);
    svg.appendChild(path);
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
