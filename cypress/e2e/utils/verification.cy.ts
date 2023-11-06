import { isValidEmail, isValidPassword } from '@/utils/verification'

describe('Test signup validation functions', () => {
    it('should check password is valid', () => {
        let result: boolean = isValidPassword('abC12345')
        expect(result).to.be.true
        result = isValidPassword('abC1234')
        expect(result).to.be.false
        result = isValidPassword('abc12345')
        expect(result).to.be.false
        result = isValidPassword('abCdefghi')
        expect(result).to.be.false
        result = isValidPassword(
            'aBc1bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
        )
        expect(result).to.be.false
    })

    it('should check that email is valid', () => {
        let result: boolean = isValidEmail('valid@gmail.com')
        expect(result).to.be.true
        result = isValidEmail('notvalidemail.com')
        expect(result).to.be.false
        result = isValidEmail('email@valid.')
        expect(result).to.be.false
        result = isValidEmail('')
        expect(result).to.be.false
        result = isValidEmail('email@.com')
        expect(result).to.be.false
    })
})
