import { removeFileExtension } from '@/utils/sendVideo'

describe('Test removeFileExtension', () => {
    it('should remove file extension if it exists', () => {
        const result: string = removeFileExtension('test.mp4')
        expect(result).to.equal('test')
    })

    it('should return the same string if no file extension', () => {
        const result: string = removeFileExtension('test')
        expect(result).to.equal('test')
    })

    it('should remove only the file extension', () => {
        const result: string = removeFileExtension('this.is.still.content.mp4')
        expect(result).to.equal('this.is.still.content')
    })
})
