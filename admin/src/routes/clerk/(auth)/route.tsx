import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Logo } from '@/assets/logo'
import { LearnMore } from '@/components/learn-more'

export const Route = createFileRoute('/clerk/(auth)')({
  component: ClerkAuthLayout,
})

// eslint-disable-next-line react-refresh/only-export-components
function ClerkAuthLayout() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background'>
      
      {/* Premium Left Column */}
      <div className='relative hidden h-full flex-col justify-between p-12 text-white lg:flex isolate overflow-hidden'>
        
        {/* Full-bleed rich architectural image */}
        <img 
          src='/images/Harvard University.jpeg' 
          alt='University Campus' 
          className='absolute inset-0 -z-20 h-full w-full object-cover object-center scale-105 transition-transform duration-700 ease-out brightness-[0.75]' 
        />
        
        {/* Multilayered radial/linear gradient overlay for dramatic contrast */}
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950/95 mix-blend-multiply' />
        <div className='absolute inset-0 -z-10 bg-gradient-to-tr from-indigo-950/40 via-transparent to-transparent' />

        {/* Top Header Section */}
        <Link 
          to='/' 
          className='relative z-20 flex items-center text-xl font-semibold tracking-tight backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit shadow-inner hover:bg-white/10 transition-all'
        >
          <Logo className='me-2.5 size-5 filter drop-shadow' /> 
          AMUST
        </Link>
        
        {/* Bottom Editorial Content */}
        <div className='relative z-20 max-w-lg space-y-6 self-start mb-4'>
          <blockquote className='space-y-3 border-l-2 border-indigo-400 pl-4'>
            <p className='text-2xl font-light tracking-wide leading-relaxed text-slate-100 antialiased'>
              &ldquo;Empowering learning through technology.&rdquo;
            </p>
            <footer className='text-xs font-semibold uppercase tracking-widest text-indigo-300/90'>
              AMUST University
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Auth Panel Container */}
      <div className='lg:p-8 flex items-center justify-center w-full h-full bg-slate-50/50 dark:bg-slate-950/10'>
        <div className='relative mx-auto flex w-full flex-col items-center justify-center gap-4 max-w-md'>
          <LearnMore 
            defaultOpen 
            triggerProps={{ 
              className: 'absolute -top-12 end-0 sm:end-8 size-6 text-muted-foreground hover:text-foreground transition-colors', 
            }} 
            contentProps={{ 
              side: 'top', 
              align: 'end', 
              className: 'w-auto' 
            }}
          >
            Welcome to the AMUST sign-in page. <br /> 
            Back to{' '}
            <Link to='/' className='underline decoration-dashed underline-offset-2 font-medium hover:text-primary transition-colors'>
              Dashboard
            </Link>{' '}
            ?
          </LearnMore>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
