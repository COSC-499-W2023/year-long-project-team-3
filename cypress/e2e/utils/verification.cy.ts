import { isValidEmail, isValidPassword, validTimestamp } from '@/utils/verification'

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

describe('Test timestamp validator', () => {
    it('should fail with bad times', () => {
        const invalidTimestamps = [
            '.',
            '4:',
            '4:5',
            '4:5:',
            '4:5:6',
            '4:5:6.',
            '4:5:6.7',
            '4:5:6.78',
            '4:5:6.789',
            '1:90:04',
            '1:0.0',
        ]

        for (const timestamp of invalidTimestamps) {
            expect(validTimestamp(timestamp)).to.be.false
        }
    })

    it('should pass with good times', () => {
        const validTimestamps = ['0', '0.0', '0.00', '0.000', '0:00', '0:00.0', '90:40.0', '90:40:40', '0.550', '90.0']

        for (const timestamp of validTimestamps) {
            expect(validTimestamp(timestamp)).to.be.true
        }
    })
})
