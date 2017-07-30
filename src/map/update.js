import * as d3 from 'd3'
import glob from '../global'
import { drag, setImage } from '../node/index'
import { call } from '../events'
import * as draw from '../draw/index'
import Utils from '../utils'

/**
 * @name update
 * @desc Update mind map with new nodes.
*/
export function update() {
    let nodeValues = glob.nodes.entries(),
        nodes = glob.svg.mmp.selectAll('.node').data( nodeValues ),
        branches = glob.svg.mmp.selectAll('.branch').data( nodeValues.slice(1) ),

    outer = nodes.enter().append('g')
        .style('cursor', 'pointer')
        .attr('class', 'node')
        .attr('id', n => n.key )
        .attr('transform', n => 'translate(' + n.value.x + ',' + n.value.y + ')')
        .on('dblclick', function( n ) {
            d3.event.stopPropagation()
            call('nodedblclick', this, n.key, n.value )
        })

    if ( glob.options['drag'] === true ) outer.call( drag )

    outer.append('text').text( n => n.value.name )
        .style('font-family', 'sans-serif')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'middle')
        .style('fill', n => n.value['text-color'])
        .style('font-size', n => n.value['font-size'])
        .style('font-style', n => Utils.fontStyle( n.value.italic ) )
        .style('font-weight', n => Utils.fontWeight( n.value.bold ) )

    outer.insert('path', 'text')
        .style('fill', n => n.value['background-color'])
        .style('stroke-width', 3 )
        .attr('d', draw.background )

    outer.each( function( n ) {
        setImage( d3.select( this ), n.value )
    })

    branches.enter().insert('path', 'g')
        .style('fill', n => n.value['branch-color'])
        .style('stroke', n => n.value['branch-color'])
        .attr('class', 'branch')
        .attr('id', n => 'branchOf' + n.key )
        .attr('d', draw.branch )

    nodes.exit().remove()
    branches.exit().remove()
}

/**
 * @name redraw
 * @desc Remove dom elements and recreate them.
*/
export function redraw() {
    d3.selectAll('.node, .branch').remove()
    update()
}
