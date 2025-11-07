export default function Footer() {
  return (
    <footer className="bg-[#01206a] text-white py-6 px-4 text-center pb-12">
      <p className="text-sm sm:text-base max-w-4xl mx-auto">
        By participating in this hackathon, you agree to abide by the{' '}
        <a
          href="https://mlh.io/code-of-conduct" //
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300 transition-colors"
        >
          MLH Code of Conduct
        </a>.
      </p>
    </footer>
  );
}
