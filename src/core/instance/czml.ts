import {
    CzmlDataSource
} from 'cesium'

export function createCzmlDataSource (name) {
    const cm = this
    const entities = cm.$viewer.entities
    let dataSource = new CzmlDataSource(name)
    entities.add(dataSource)
}